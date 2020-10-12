exports.queryConditionAds = (condition, ownerID) => {
    $and: [
        condition,
        {
            $or: [
                {private : false},
                {owner : ownerID},
            ]
        }
    ]
  };
  