import { body } from 'express-validator'

export const login = [
    body('email', 'неверный формат почты').isEmail(),
    body('password', "Пароль должен быть минимум 5 символов").isLength({min: 5}),
]

export const register = [
    body('email', 'неверный формат почты').isEmail(),
    body('password', "Пароль должен быть минимум 5 символов").isLength({min: 5}),
    body('fullName', "укажите имя").isLength({min: 3}),
    body('avatarUrl', "Неверная ссылка на аватраку").optional().isURL()
]

export const postCreate = [
    body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
    body('text', "Введите текст статьи").isLength({min: 3}).isString(),
    body('tags', "Неверный формат тэгов").optional().isArray(),
    body('imageUrl', "Неверная ссылка на изображение").optional().isString()
]