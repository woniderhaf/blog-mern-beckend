import UserModel from '../modules/User.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator';

export const register = async (req,res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHach: hash,
            avatar: req.body.avatarUrl
        })
        const user = await doc.save()
        const token = jwt.sign(
            {
                _id: user._id
            },
            'secret1234',
            {
                expiresIn: '30d'
            }
        )
        const {passwordHach, ...userData} = user._doc
        res.json({
            ...userData,
            token
        })
    } catch (error) {
        res.json({error: ` --> ${error}`})
    }
}

export const getMe = async (req,res) => {
    try {
        const user = await UserModel.findById(req.userId)
        if (!user) res.status(404).json({message: 'пользователь не найден'})
        const {passwordHach, ...userData} = user._doc
        res.json({
            ...userData
        })
    } catch (error) {
        res.status(500).json({message: 'нет доступа'})
    }
}

export const login = async (req,res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email})
        if (!user) {
            return res.status(404).json({message: 'пользователь не найден'})
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHach)
        if (!isValidPass) {
            return res.status(404).json({
                message: 'неверный логин или пароль'
            })
        }

        const token = jwt.sign(
            {
                _id: user._id
            },
            'secret1234',
            {
                expiresIn: '30d'
            }
        )

        const {passwordHach, ...userData} = user._doc
        res.json({
            ...userData,
            token
        })

    } catch (error) {
        console.log('login error ->', error)
        res.json({
            message: 'вход не выполнен',
            error
        })
    }
}