/**
 * PelangganController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const Pelanggan = require("../models/Pelanggan");

module.exports = {
  
    'new':function(req,res){
        res.view();
    },
    
    create:function(req,res,next){
        Pelanggan.create(req.allParams(),function pelangganCreated(err,pelanggan){
            if(err) return next(err);

            res.redirect('/pelanggan/show/' + pelanggan.id)
        });
    },

    show: function(req,res,next){
        const params = req.allParams();
        Pelanggan.findOne(params.id, function foundPelanggan(err,pelanggan){
            if(err) return next(err);

            if(!pelanggan) return next();

            res.view({
                pelanggan: pelanggan
            });
        });
    }


};

