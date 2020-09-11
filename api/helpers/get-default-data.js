const UserService = require('../services/UserService');
var moment = require("moment");
const i18n = require('../../config/i18n');

module.exports = {

  friendlyName: 'Generate default data object',
  description: 'Generate default data object',

  inputs: {
    req: {
      type: 'ref',
      description: 'The current incoming request (req).',
      required: true
    }
  },
  exits: {
    success: {}
  },
  fn: async function (inputs, exits) {
    sails.log.info("=== helper/get-default-data => START ===========");
    // GET CURRENT SESSION OF BRANCH
    let courseSessionObj = await CourseSessionService.get({ isCurrent: true, status : sails.config.custom.STATUS.ACTIVE });
    
    let listClasses = [];
    if (courseSessionObj) {
      listClasses = await ClassService.find({ courseSession: courseSessionObj.id, status: sails.config.custom.STATUS.ACTIVE });
    }
    
    let listBranches = await BranchService.find({ status: sails.config.custom.STATUS.ACTIVE });
    let sortBranchArr = [];

    // CHECK CLASS AVAILABLE WITH CURRETN SESSION
    for (let branch of listBranches) {
      let classAvailable = [];
      for (let classes of branch.classes) {
        if (classes.courseSession == courseSessionObj.id) {
          classAvailable.push(classes)
        }
      }  
      branch.classes = classAvailable;
      sortBranchArr.push(branch);
    }

    listBranches = sortBranchArr;

    // let objList = {};
    // for (let item of listCourseSession) {
    //   objList[item.id] = item;
    // }
    let currCourseSession = courseSessionObj ? courseSessionObj : {};
    
    let classActiveByBranch = [];
    let classActive = "";
    
    let classActiveTitle = "";
    let params = inputs.req.allParams();
    let branchActive = params.branchId;
    if (params.classId) {
      classActive = params.classId;
    }
    // PREPARE DATA FOR STUDENT FOLLOW THE BRANCH AND SPECIFIC CLASS.
    if (classActive && params.branchId && params.classId != '0' && params.classId != 'undefined') {
      let classActiveObj = await Class.findOne({ id: classActive, branch: params.branchId });
      classActiveTitle = classActiveObj.title;
    }
    // PREPARE DATA FOR STUDENT FOLLOW THE BRANCH WITH ALL CLASS.
    if (params.branchId) {
      let classArr = await ClassService.find({branch: branchActive, courseSession: courseSessionObj.id});
      classActiveByBranch = classArr;
    } else if (listBranches.length) {
      let classArr = await ClassService.find({branch: listBranches[0].id, courseSession: courseSessionObj.id});
      classActiveByBranch = classArr;
    }
   

    
    //data for format currency
    // let currencyCode = '';
    let symbolLeft = '';
    let symbolRight = '';
    let decimalPoint = '';
    let numberSeperatorSymbol = '';
    let decimalPlaces = 0;
    if (sails.config.custom.webSettings && sails.config.custom.webSettings.value && sails.config.custom.webSettings.value.currency) {
      let currencyObj = await Currency.findOne({ id: sails.config.custom.webSettings.value.currency });
      if (currencyObj) {
        // currencyCode = currencyObj.code;
        symbolLeft = currencyObj.symbolLeft;
        symbolRight = currencyObj.symbolRight;
        decimalPoint = currencyObj.decimalPoint;
        numberSeperatorSymbol = currencyObj.numberSeperatorSymbol;
        decimalPlaces =  currencyObj.decimalPlaces;
      }
    }
    let webSettings = await SettingService.get({ key: 'web' });
    let page = params.page ? parseInt(params.page) : 1;

    let catID = params.category ? params.category : null;
		let limit = 10;
    let skip = (page - 1) * limit;
    let where = {};

    if (catID != null) {
      where = {
        category : catID
      }
    }
    
    // PREPARE DATA NEWS PAGING
    let listNews = await PostCategoryService.find(where);
    let lengthOfPage = listNews.length;
    //GET NUMBER OF PAGES.
    var numberOfPages = Math.floor((lengthOfPage + limit - 1) / limit);

    let _default = await {
      userActive: inputs.req.me,
      webSettings: webSettings,
      branchActive: branchActive,
      classActiveByBranch : classActiveByBranch,
      classActive: classActive,
      classActiveTitle: classActiveTitle,
      moduleActive: inputs.req.options,
      listClasses: listClasses,
      listBranches:listBranches,
      listCourseSession: courseSessionObj,
      currCourseSession: currCourseSession,
      symbolLeft: symbolLeft,
      symbolRight: symbolRight,
      decimalPoint: decimalPoint,
      numberSeperatorSymbol: numberSeperatorSymbol,
      decimalPlaces: decimalPlaces,
      moment: moment,
      url: inputs.req.path,
      lang: i18n.i18n.defaultLocale,
      lengthOfPage: lengthOfPage,
      numberOfPages: numberOfPages,
      categoryActive: catID,
      pageActive: page
    };
    //set curr language equal with defaultLocale
    inputs.req.setLocale(i18n.i18n.defaultLocale);
    _default = await _.extend(sails.config.custom, _default);

    return exits.success(_default);
  }
};
