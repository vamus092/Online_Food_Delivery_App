
jest.mock('uuid', () => ({ v4: () => '1234' }));

const { createMenu, getAllMenus } = require('../controllers/menuController');
const { Item } = require('../models/itemModel');
const Menu = require('../models/menuModel');
const Restaurant = require('../models/restaurantModel');


jest.mock('../models/itemModel');
jest.mock('../models/menuModel');
jest.mock('../models/restaurantModel');

describe('Menu Controller Unit Tests', () => {
    let req, res;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    
    describe('getAllMenus', () => {
        it('should return all menus with 200 status', async () => {
            const mockMenus = [{ SectionName: 'Starters', items: [] }];
            
            
            Menu.find.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockMenus)
            });

            await getAllMenus(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ message: "All menu founds--Success", data: mockMenus })
            );
        });
    });

    // TEST CASE 2: createMenu
    describe('createMenu', () => {
        it('should create a new item and menu section, then return 201', async () => {
            req = {
                body: { name: 'Pizza', price: 10, description: 'Cheesy', sectionName: 'Main' },
                params: { resId: 'res123' },
                file: { path: 'uploads\\image.png' }
            };

        
            Item.create.mockResolvedValue({ _id: 'item1', itemName: 'Pizza' });

            
            Restaurant.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue({ _id: 'res123', menus: [] })
            });

        
            Menu.findOne.mockResolvedValue(null);
            Menu.create.mockResolvedValue({ _id: 'menu1', SectionName: 'Main' });
            
            
            Restaurant.findByIdAndUpdate.mockResolvedValue({});

            
            Menu.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue({ _id: 'menu1', items: ['item1'] })
            });

            await createMenu(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ message: "Menu Created/Updated Successfully" })
            );
        });
    });

});
