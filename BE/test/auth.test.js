// MUST BE AT THE TOP
jest.mock('uuid', () => ({ v4: () => 'mocked-uuid-1234' }));

const { createUser, loginHandler } = require('../controllers/authController');
const { User } = require('../models/userModel');
const { Addresses } = require('../models/addressModel');
const bcrypt = require('bcrypt');

// Mock other dependencies
jest.mock('../models/userModel');
jest.mock('../models/addressModel');
jest.mock('../utils/authService');
jest.mock('bcrypt');

describe('Auth Controller Unit Tests', () => {
    let req, res, next;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            cookie: jest.fn().mockReturnThis()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should create user with 201 status', async () => {
            req = {
                body: {
                    username: 'test', email: 't@t.com', 
                    password: '123', confirmPassword: '123',
                    dob: '1990-01-01', address: {}
                }
            };

            Addresses.create.mockResolvedValue({ _id: 'addr_1' });
            bcrypt.genSalt.mockResolvedValue('salt');
            bcrypt.hash.mockResolvedValue('hash');
            User.create.mockResolvedValue({ _id: 'u_1', username: 'test' });

            await createUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('loginHandler', () => {
        it('should return 200 on successful login', async () => {
            req = { body: { email: 't@t.com', password: '123' } };
            
            const mockUser = { _id: 'u_1', password: 'hashed_password' };
            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            // Mock the callback-based bcrypt.compare
            bcrypt.compare.mockImplementation((pw, hash, cb) => cb(null, true));

            await loginHandler(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});