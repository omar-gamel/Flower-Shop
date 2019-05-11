const express = require('express');
const upload = require('../services/multer');
const authController = require('../controller/auth');

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   User:
 *     required:
 *     - "email"
 *     - "password"
 *
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 */
/**
 * @swagger
 * /user/signup:
 *   post:
 *     tags:
 *       - Users
 *     summary:
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     description: Create New User
 *
 *     parameters:
 *       - name: userName
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         in: formData
 *         required: true
 *       - name: password
 *         in: formData
 *         required: true
 *       - in: formData
 *         name: userimage
 *         type: file
 *         required: true
 *
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Check your Email Address or password  
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not Found
 *       422:
 *         description: Unprocessable entity
 *       500:
 *         description: Internal Server Error
 *       
 */
router.post('/signup', upload.single('userimage'), authController.signUp);

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: 
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     description: User Login 
 *
 *     parameters:
 *       - name: email
 *         in: formData
 *         required: true
 *       - name: password
 *         in: formData
 *         required: true
 *
 *     responses:
 *       200:
 *         description: Login Successfully 
 *       401:
 *         description: unAuthorized 
 *       404:
 *         description: User Not Found    
 *       500:
 *         description: Internal Server Error
 */
router.post('/login', authController.login);

router.get('/', authController.all_users);

router.get('/:userId', authController.singleUser);

router.delete('/:userId', authController.deleteUser);

module.exports = router;