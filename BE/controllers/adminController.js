const  Agent  = require('../models/agentSchema');
const Order = require('../models/orderModel');

exports.createAgent = async(req,res)=>{
      let agent = await Agent.create({...req.body})
      console.log(agent);
      return res.status(201).json({message:"Agent created Successfully...",data:agent});
}

exports.assignAgent = async(req,res,next)=>{
    console.log(req.params.agentId);
    console.log("Status");
    console.log(req.body.status);
    try{
        let agent = await Agent.findById(req.params.agentId);
        console.log(agent);
        let order = await Order.findById(req.params.orderId);
        console.log(order);
    if(!agent){
         return res.status(404).json({message:"Agent not found..."});
      }

    if(!order){
        return res.status(404).json({message:"Order not found"});
    }

    if(agent.availability !== true){
          return res.status(404).json({message:"Agent is not available..."});

    }
    else{
          console.log("Agent Id...");
          console.log(agent);
          let updatedOrder = await Order.findOneAndUpdate({_id:order._id},{agentAssigned:agent._id,status:req.body.status},{new :true,runValidators: true }).populate('agentAssigned');

          let updatedAgent = await Agent.findOneAndUpdate({_id:agent._id},{orderAssigned:order._id,availability:false},{new :true,runValidators: true });
          console.log(updatedAgent);
          return res.status(200).json({message:"Agent assigned Successfully...",data:updatedOrder});
      }
    }
    catch(err){
        //   return res.status(200).json({message:"Error occurred",data:err.message});
        next(err);
    }
   
}

exports.getAllAgents = async(req,res,next)=>{
    try{
        console.log("Inside get-All-Agents")
        console.log(req.query.available);
        if(req.query.available !== undefined && req.query.available !== null){
            let agents = await Agent.find({availability:req.query.available});
            console.log(agents);                
            return res.status(200).json({message:"Agents fetched successfully...",data:agents});
        }
        else{
            let agents = await Agent.find();                
            return res.status(200).json({message:"Agents fetched successfully...",data:agents});
        }
    }
    catch(err){
        next(err);
    }
}