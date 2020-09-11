let moment = require('moment');
module.exports = {
    exits:{
        success:{
            viewTemplatePath : 'frontend/pages/home/index',
            description: 'Menampilkan dashboard untuk user yang diijinkan.'
        },
        redirect:{
            responseType: 'redirect'
        }
    },
    fn: async function(inputs,exits){
        let _default = await SVGPathSegList.helpers.getDefaultData(this.req)

        _default.webSettings = webSettings;
        _default.moment = moment;
        return exits.success();
    }
}