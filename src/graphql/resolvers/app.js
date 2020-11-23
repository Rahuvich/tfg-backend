import util from 'util'
import {InfoApp} from '../../models/info_app'


module.exports = {
  Query: {
    info: async (_, args, req) => {
        
      try {
        return await InfoApp.find();
      } catch (err) {
        throw err;
      }
    },
  },  
};
