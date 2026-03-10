const { createRestaurant, getRestaurantById } = require('../controllers/restaurantController');
const Restaurant = require('../models/restaurantModel');
const { User } = require('../models/userModel');

// Mock the models
jest.mock('../models/restaurantModel');
jest.mock('../models/userModel');

describe('Restaurant Controller Unit Tests', () => {
    let req, res;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    // TEST CASE 1: createRestaurant
    describe('createRestaurant', () => {
        it('should create a restaurant linked to the logged-in user', async () => {
            // Simulate the user info usually added by an auth middleware
            req = {
                user: { id: 'user123' },
                body: { restaurantName: 'The Pizza Place', location: 'New York' }
            };

            // 1. Mock finding the user
            User.findById.mockResolvedValue({ _id: 'user123', username: 'manager1' });

            // 2. Mock creating the restaurant
            const mockNewRes = { _id: 'res999', ...req.body, managedBy: 'user123' };
            Restaurant.create.mockResolvedValue(mockNewRes);

            await createRestaurant(req, res);

            expect(User.findById).toHaveBeenCalledWith('user123');
            expect(Restaurant.create).toHaveBeenCalledWith(expect.objectContaining({
                managedBy: 'user123'
            }));
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ message: "Restaurant created Successfullly..." })
            );
        });
    });

    // TEST CASE 2: getRestaurantById (Using managedBy logic)
    describe('getRestaurantById', () => {
        it('should return restaurants managed by a specific user', async () => {
            req = { params: { userId: 'user123' } };
            const mockRestaurants = [{ _id: 'res1', restaurantName: 'Burger King' }];

            // Mock Restaurant.find().populate()
            Restaurant.find.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockRestaurants)
            });

            await getRestaurantById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ data: mockRestaurants })
            );
        });

        it('should return 404 if no restaurant is found for that user', async () => {
            req = { params: { userId: 'user404' } };

            // Mock find to return an empty array
            Restaurant.find.mockReturnValue({
                populate: jest.fn().mockResolvedValue([])
            });

            await getRestaurantById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ message: "Restaurant with given restaurant-Id does not exists" })
            );
        });
    });
});