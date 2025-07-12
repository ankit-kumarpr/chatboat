const mongoose=require('mongoose');

const GroupSchema=new mongoose.Schema({
    groupId:{
        type:String
    },
    groupname:{
        type:String,
        required:true
    },
    grouptype:{
        type:String,
        enum:['public','private'],
        default:'public'
    },
    chat:{
        type:String,
        enum:['enabled','disable'],
        default:'enabled'
    },
   users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  createdAt:{
    type:Date,
    default:Date.now()
  }
})

module.exports=mongoose.model('Group',GroupSchema);