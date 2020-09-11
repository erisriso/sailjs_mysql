/**
 * @copyright 2017 @ ZiniMedia Team
 * @author thanhvo
 * @create 2017/10/25 09:52
 * @update 2017/10/25 09:52
 * @file api/services/MediaService.js
 */
'use strict';

const MediaService = {
    get: async (options) => {
        sails.log.info("================================ MediaService.get -> options: ================================");
        sails.log.info(options);

        let records = await Media.findOne(options);
        return records;
        
    },

    add : async (options) => {
        sails.log.info("================================ MediaService.add -> options: ================================");
        sails.log.info(options);
        
        let newObj = await Media.create(options)
        // Some other kind of usage / validation error
        .intercept('UsageError', (err)=> {
            return 'invalid';
        })
        .fetch();
        sails.log.info("================================ MediaService.add -> new object: ================================");
        sails.log.info(newObj);
        return newObj;
    },

    edit: async (query, params) => {
        sails.log.info("================================ MediaService.edit -> query, params: ================================");
        sails.log.info(query);
        sails.log.info(params);

        let options = {};

        for(let key in Media.attributes) {
            if( key === "id" || key === "createdAt" || key === "toJSON" ) continue;

            if(params && typeof(params[key]) !== "undefined") {
                options[key] = params[key];
            }
        }

        options.updatedAt = new Date().getTime();
        
        let editObj = await Media.update(query, options).fetch();
        sails.log.info("================================ MediaService.edit -> edit object: ================================");
        sails.log.info(editObj);
        return editObj;
    },

    del: (options, cb) => {
        sails.log.info("================================ MediaService.del -> options: ================================");
        sails.log.info(options);

        Media.destroy(options).exec( (error, deletedRecords) => {
            if(error) {
                sails.log.error(error);
                return cb(error, null);
            }

            return cb(null, deletedRecords);
        });
    },

    find:  async( where, limit, skip, sort) => {
        sails.log.info("================================ MediaService.find -> where: ================================");
        sails.log.info(JSON.stringify(where));
        sails.log.info(limit);
        sails.log.info(skip);
        sails.log.info(sort);
        where = (typeof where === 'object') ? where : {};
        limit = (limit !== null && typeof skip === 'number' ) ? limit : 10;
        skip = (skip !== null && typeof skip === 'number') ? skip: 0;
        sort = (sort !== null && typeof sort === 'object') ? sort : [{ createdAt: 'DESC' }];

        let medias = await Media.find({ where: where, limit: limit, skip: skip, sort: sort })
        return medias;    
    },

    count: async (where) => {
        where = (typeof where === 'object') ? where : {};
        let totalMedia  = await Media.count(where);
        return totalMedia;
    }
};

module.exports = MediaService;