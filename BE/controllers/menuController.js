const { get } = require('node:http');
const { Item } = require('../models/itemModel');
const Menu = require('../models/menuModel');
const Restaurant = require('../models/restaurantModel');
const mongoose = require('mongoose');

exports.createMenu = async (req, res) => {
  try {
    const { itemName, price, description, sectionName } = req.body;
    console.log(req.body);
    let imagePath = null;
    console.log(req.file.path);
    if (req.file) {
      imagePath = req.file.path.replace(/\\/g, "/");
    }

    // Step 1: Create a new item
    const newItem = await Item.create({
      itemName: itemName,
      price,
      description,
      imagePath,
    });

    // Step 2: Find the restaurant
    const restaurant = await Restaurant.findById(req.params.resId).populate("menus");
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found with the given ID" });
    }

    // Step 3: Check if the restaurant already has a menu for this section
    let menu = await Menu.findOne({
      restaurantId: restaurant._id,
      SectionName: sectionName,
    });

    if (menu) {
      // If menu exists for this section, add the item
      await Menu.findByIdAndUpdate(
        menu._id,
        { $addToSet: { items: newItem._id } }, // avoids duplicates
        { new: true }
      );
    } else {
      // If no menu exists for this section, create a new one
      menu = await Menu.create({
        restaurantId: restaurant._id,
        SectionName: sectionName,
        items: [newItem._id],
      });

      // Link the new menu to the restaurant
      await Restaurant.findByIdAndUpdate(
        restaurant._id,
        { $addToSet: { menus: menu._id } },
        { new: true }
      );
    }

    // Step 4: Return populated menu
    const populatedMenu = await Menu.findById(menu._id).populate("items");
    return res.status(201).json({ message: "Menu Created/Updated Successfully", data: populatedMenu });

  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "Failed to create or update menu",
      error: err.message,
    });
  }
};

exports.getAllMenus = async (req, res) => {
  let menuList = await Menu.find({}).populate('items');
  console.log("menuList");
  console.log(menuList);
  if (menuList == []) {
    return res.status(200).json({ message: "Success", data: "No menu list found" });
  }
  return res.status(200).json({ message: "All menu founds--Success", data: menuList });

}

exports.getMenuById = async (req, res) => {
  console.log(req.params.itemId);
  const Id = req.params.itemId;
  if (!mongoose.Types.ObjectId.isValid(Id)) {
  return res.status(400).json({ message: "Invalid itemId format" });
}
  const menuItem = await Item.findOne({ _id: Id }).select('-updatedAt -__v -createdAt');
  console.log("Menu Item found by ID:");
  console.log(menuItem);
  if (!menuItem) {
    return res.status(200).json({ message: "Success", data: "Menu with given menu-Id does not exists" });
  }
  return res.status(200).json({ message: "Success--Menu found", data: menuItem });
}

exports.editMenuItem = async (req, res) => {
  // let menu = await Item.findById(req.params.id)
  let menuItem = await Item.findById(req.params.id,{ new: true, runValidators: true });
  console.log("menu-Item ...");
  console.log(menuItem);
  if (menuItem) {
    let updatedMenu = await Item.findOneAndUpdate({ _id: menuItem._id }, { $set: req.body }, { new: true, runValidators: true });
    return res.status(200).json({ message: "Menu edited successfully", data: updatedMenu });
  }
  else {
    return res.status(404).json({ message: "Fail", data: "Menu with given Menu-Id not found" });
  }

}

exports.getMenuBySectionName = async (req, res) => {  
  console.log("ResId : " , req.params.resId);
  console.log("Section Name from params:", req.params.sectionName);
  
// Find restaurant and populate only the menus that match sectionName
    let restaurant = await Restaurant.findById(req.params.resId)
      .populate({
        path: 'menus',
        match: { SectionName: req.params.sectionName},   // filter menus by sectionName
        populate: { path: 'items' }            // populate items inside that menu
      });
      console.log(restaurant);

  if (!req.params.sectionName) {
    return res.status(400).json({ message: "Section name is required in the request parameters" });
  }
  let menu = await Menu.findOne({ SectionName: req.params.sectionName }).populate('items');
  if (!menu) {
    return res.status(404).json({ message: "Menu section not found with the given section name" });
  }
  return res.status(200).json({ message: "Menu section found successfully", data: restaurant });
}

exports.getMenuItems = async (req, res) => {
  try {
    const { resId, sectionName } = req.params;
    const { searchTerm } = req.query; // searchTerm will come as query param
    
    console.log(searchTerm);

    // Find the menu section for the given restaurant and section name
    const menuSection = await Menu.findOne({
      restaurantId: resId,
      SectionName: sectionName
    }).populate('items');

    if (!menuSection) {
      return res.status(404).json({ message: 'Menu section not found' });
    }

    let items = menuSection.items;

    // Apply search filter if searchTerm is provided
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i'); // case-insensitive
      items = items.filter(item => regex.test(item.itemName)); // assuming Item has a 'name' field
    }

    console.log("Items found .....................");
    console.log(items);
    res.status(200).json({ searchedData:items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.deleteMenuItem = async (req, res) => {
  console.log("Menu Item ID from params:", req.params.itemId);
  console.log("Menu Id  from params:", req.params.menuId);
  
  let item = await Item.findById(req.params.itemId);

  if (!item) {
    return res.status(404).json({ message: "Menu item not found..." });
  }

  let menuItem = await Item.findOneAndDelete({ _id: req.params.itemId }, { new: true });
  // console.log("Menu Item to be deleted ...");
  // console.log(menuItem);

  // let menu = await Menu.findOne({ SectionName: req.params.sectionName }).populate('items');
  // // console.log(menu);

  let updatedMenu = await Menu.updateOne({ _id: req.params.menuId }, { $pull: { items: req.params.itemId } });
  console.log(updatedMenu);

  return res.status(200).json({ message: "Menu item deleted Successfully...", data: menuItem });
}

exports.deleteMenu = async (req, res) => {
  let menu = await Menu.findById(req.params.menuId);
  // console.log(menu);

  // console.log(req.params.menuId);
  if (!menu) {
    return res.status(404).json({ message: "Menu not found..." });
  }
  else {
    let deletedMenu = await Menu.findOneAndDelete({ _id: req.params.menuId }, { new: true });
    // console.log(deletedMenu);
    // Then delete all items linked to that menu 
    // Item._id ===  ["bhgjhi","hguhij"] delete this items 
    if (deletedMenu) {
      await Item.deleteMany({ _id: { $in: deletedMenu.items } });
    }
    let restaurant = await Restaurant.findOneAndUpdate({ _id: req.params.resId }, { $pull: { menus: req.params.menuId } }, { new: true });
    // console.log(restaurant);
    return res.status(201).json({ message: "Menu Section deleted Successfully...", data: deletedMenu });
    // Then delete all items linked to that menu 
  }
}
