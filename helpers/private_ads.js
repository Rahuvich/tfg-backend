exports.privateAdsOnly = (condition, creatorID) => {
    if(!condition) condition = {};
    
    var creatorCondition = {private:false}

    if(creatorID){
        creatorCondition = {creator : creatorID}
    }
    return {
        $and: [
            condition,
            {
                $or: [
                    {private : false},
                    creatorCondition
                ]
            }
        ]
        
    }
    
  };
  