const { createAgent, assignAgent } = require('../controllers/adminController'); 
const Agent = require('../models/agentSchema');
const Order = require('../models/orderModel');


jest.mock('../models/agentSchema');
jest.mock('../models/orderModel');

describe('Admin Controller Unit Tests', () => {
    let req, res, next;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

 
    describe('createAgent', () => {
        it('should create an agent and return 201 status', async () => {
            req = { body: { name: 'Agent Smith', vehicle: 'Bike' } };
            
            // Mocking Agent.create
            Agent.create.mockResolvedValue({ _id: 'agent123', ...req.body });

            await createAgent(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ message: "Agent created Successfully..." })
            );
        });
    });

    // TEST CASE 2: assignAgent
    describe('assignAgent', () => {
        it('should assign an available agent to an order', async () => {
            req = {
                params: { agentId: 'agent123', orderId: 'order456' },
                body: { status: 'Assigned' }
            };

        
            Agent.findById.mockResolvedValue({ _id: 'agent123', availability: true });
            
            
            Order.findById.mockResolvedValue({ _id: 'order456' });

            
            Order.findOneAndUpdate.mockReturnValue({
                populate: jest.fn().mockResolvedValue({ _id: 'order456', status: 'Assigned' })
            });
            Agent.findOneAndUpdate.mockResolvedValue({ _id: 'agent123', availability: false });

            await assignAgent(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ message: "Agent assigned Successfully..." })
            );
        });
    });

});

