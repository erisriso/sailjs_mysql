module.exports = {
  friendlyName: 'Generate default web module',
  description: 'Generate default web module',

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
    let _actions = [];
    let _filter = {
      branchClass: false,
      gender: false,
      status: false,
      date: false,
      userType: false
    };

    let _default = {
      headline : '',
      description : '',
      url: inputs.req.options.action,
      actions: _actions,
      isFilter: false,
      filters: _filter
    }; 

    switch (inputs.req.options.action) {

      //---------------------DASHBOARD---------------------
      case 'backend/dashboard/index':
        _default.headline = sails.__('Dashboard');
        _default.description = sails.__('Dashboard');
      break;
      
      //---------------------SETTING---------------------
      case 'backend/setting/index':
        _default.headline = sails.__('Settings');
        _default.description = sails.__('Settings');
        break;
      
      //---------------------FEE COLLECTION SETTING---------------------
      case 'backend/setting/fee-collection-setting':
        _default.headline = sails.__('Settings');
        _default.description = sails.__('Settings');
      break;
      
      //---------------------STUDENT---------------------
      case 'backend/student/list':
        _default.headline = sails.__('Students');
        _default.description = sails.__('Students');
        _default.actions = [{
            'title': sails.__('Add New'),
            'href': '/backend/student/add'
        },
        {
            'title': sails.__('Import'),
            'href': 'import'
          },
        ];
        _default.isFilter = true;
        _default.filters.branchClass = true;
        _default.filters.gender = true;
        _default.filters.status = true;
        
      break;
      case 'backend/student/form':
        if(inputs.req.params.id) {
          _default.headline = sails.__('Edit student');
          _default.description = sails.__('Edit student');
        } else {
          _default.headline = sails.__('Add new student');
          _default.description = sails.__('Add new student');
        }
      break;
      
      //---------------------POST (NEWS)---------------------
      case 'backend/post/form':
        if(inputs.req.params.id) {
          _default.headline = sails.__('Edit post');
          _default.description = sails.__('Edit post');
        } else {
          _default.headline = sails.__('Add new post');
          _default.description = sails.__('Add new post');
        }
        _default.actions = [];
      break;
      case 'backend/post/list':
        _default.headline = sails.__('Posts');
        _default.description = sails.__('Posts');
        _default.actions = [{
            'title': sails.__('Add new post'),
            'href': '/backend/post/add'
          }
        ];
      break;

      //---------------------POST (PAGE)---------------------
      case 'backend/page/form':
        if(inputs.req.params.id) {
          _default.headline = sails.__('Edit page');
          _default.description = sails.__('Edit page');
        } else {
          _default.headline = sails.__('Add new page');
          _default.description = sails.__('Add new page');
        }
      break;
      case 'backend/page/list':
        _default.headline = sails.__('Pages');
        _default.description = sails.__('Pages');
        _default.actions = [{
            'title': sails.__('Add new page'),
            'href': '/backend/page/add'
          }
        ];
      break;
      
      //---------------------USER---------------------
      case 'backend/user/index':
        _default.headline = sails.__('Staffs');
        _default.description = sails.__('Staffs');
        _default.actions = [{
            'title': sails.__('Add new staff'),
            'href': '/backend/user/add'
          }
        ];

        _default.isFilter = true;
        _default.filters.userType = true;
      break;      
      //---------------------USER-FORM---------------------
      case 'backend/user/form':
        if(inputs.req.params.id) {
          _default.headline = sails.__('Edit staff');
          _default.description = sails.__('Edit staff');
        } else {
          _default.headline = sails.__('Add new');
          _default.description = sails.__('Add new');
        }
      break;      
      //---------------------COURSE-SESSION---------------------
      case 'backend/coursesession/index':
        _default.headline = sails.__('Course sessions');
        _default.description = sails.__('Course sessions');
        _default.actions = [{
            'title': sails.__('Add new'),
            'modal': '#modal-edit'
          }
        ];
      break;   
      //---------------------SUBJECT---------------------
      case 'backend/subject/index':
        _default.headline = sails.__('Subjects');
        _default.description = sails.__('Subjects');
        _default.actions = [
          {
            'title': sails.__('Add new'),
            'modal': '#modal-edit'
          }
        ];
      break;   
      //---------------------FOOD---------------------
      case 'backend/food/index':
        _default.headline = sails.__('Foods');
        _default.description = sails.__('Foods');
        _default.actions = [
          {
            'title': sails.__('Add new'),
            'modal': '#modal-edit'
          }
        ];
        break;   
      //---------------------BRANCH---------------------
      case 'backend/branch/list':
        _default.headline = sails.__('Branches');
        _default.description = sails.__('Branches');
        _default.actions = [
          {
            'title': sails.__('Add new'),
            'modal': '#modal-edit'
          }
        ];
      break;
      //---------------------CLASS---------------------
      case 'backend/class/list':
        _default.headline = sails.__('Classes');
        _default.description = sails.__('Classes');
        _default.actions = [
          {
            'title': sails.__('Add new'),
            'modal': '#modal-edit'
          }
        ];
      break;
       //---------------------CATEGORY---------------------
      case 'backend/taxonomy/categories':
        _default.headline = sails.__('Categories');
        _default.description = sails.__('Categories');
        _default.actions = [
          {
            'title': sails.__('Add new'),
            'modal': '#modal-edit'
          }
        ];
      break;
      //---------------------TAGS---------------------
      case 'backend/taxonomy/tag':
        _default.headline = sails.__('Tags');
        _default.description = sails.__('Tags');
        _default.actions = [
          {
            'title': sails.__('Add new'),
            'modal': '#modal-edit'
          }
        ];
      break;
       //---------------------NOTIFICATION---------------------
      case 'backend/notification/list':
        _default.headline = sails.__('Notifications');
        _default.description = sails.__('Notifications');
        _default.actions = [
          {
            'title': sails.__('Add new'),
            'modal': '#modal-edit'
          }
        ];
      break;
      //---------------------ALBUM-FORM---------------------
      case 'backend/album/form':
        if(inputs.req.params.id) {
          _default.headline = sails.__('Edit album');
          _default.description = sails.__('Edit album');
        } else {
          _default.headline = sails.__('Add New');
          _default.description = sails.__('Add New');
        }
      break;      
      //---------------------ALBUM-VIEW---------------------
      case 'backend/album/view':
        _default.headline = sails.__('View album');
        _default.description = sails.__('View album');
      break;      
      //---------------------ALBUM---------------------
      case 'backend/album/list':
        _default.headline = sails.__('Albums');
        _default.description = sails.__('Albums');
        _default.actions = [
          {
            'title': sails.__('Add New'),
            'href': '/backend/album/add'
          }
        ];
      break;      
      //---------------------PARENT---------------------
      case 'backend/parent/list':
        _default.headline = sails.__('Parent');
        _default.description = sails.__('Parent');
        _default.actions = [
          {
            'title': sails.__('Add new'),
            'href': '/backend/parent/add'
          },
          {
            'title': sails.__('Import'),
            'href': 'import'
          }
        ];
        
        _default.isFilter = true;
        _default.filters.branchClass = true;
        _default.filters.status = true;
      break;  
       //---------------------PARENT-FORM---------------------
      case 'backend/parent/form':
        if(inputs.req.params.id) {
          _default.headline = sails.__('Edit parent');
          _default.description = sails.__('Edit parent');
        } else {
          _default.headline = sails.__('Add new');
          _default.description = sails.__('Add new');
        }
      break;  
      //---------------------IMPORT-PARENT---------------------
      case 'backend/import/parent':
        _default.headline = sails.__('Import parent');
        _default.description = sails.__('Import parent');
      break;       
      //---------------------IMPORT-STUDENT---------------------
      case 'backend/import/form':
        _default.headline = sails.__('Import students');
        _default.description = sails.__('Import students');
      break;          
      //---------------------ATTENDENT---------------------
      case 'backend/attendent/index':
        _default.headline = sails.__('Attendent');
        _default.description = sails.__('Attendent');
        
        _default.isFilter = true;
        _default.filters.branchClass = true;
        _default.filters.date = true;
      break;
      //---------------------PICKUP---------------------
      case 'backend/pickup/index':
        _default.headline = sails.__('Pickup');
        _default.description = sails.__('Pickup');
        
        _default.isFilter = true;
        _default.filters.branchClass = true;
        _default.filters.date = true;
      break;          
      //---------------------SCHEDULE---------------------
      case 'backend/schedule/index':
        _default.headline = sails.__('Schedule');
        _default.description = sails.__('Schedule');
        _default.actions = [
          {
            'title': sails.__('Add new'),
            'modal': '#modalSchedule'
          }
        ];
      break;          
      //---------------------MENU---------------------
      case 'backend/menu/index':
        _default.headline = sails.__('Menu');
        _default.description = sails.__('Menu');
        _default.actions = [
          {
          'title': sails.__('Add new'),
          'modal': '#modalMenu'
          }
        ];
      break;         
      //---------------------MESSENGER---------------------
      case 'backend/message/index':
        _default.headline = sails.__('Messenger');
        _default.description = sails.__('Messenger');
      break;    
      //---------------------MESSENGER DETAILS ---------------------
      case 'backend/message/detail':
        _default.headline = sails.__('Messenger');
        _default.description = sails.__('Messenger');
      break;    
      //---------------------PROFILE----------------------
      case 'backend/account/view-edit-profile':
        _default.headline = sails.__('Edit profile');
        _default.description = sails.__('Edit profile');
        break;
      
      //---------------------CURRENCY---------------------
      case 'backend/currency/index':
        _default.headline = sails.__('Currency');
        _default.description = sails.__('Currency');
        _default.actions = [
          {
            'title': sails.__('Add new'),
            'modal': '#modal-edit'
          }
        ];
        break; 
      
      //---------------------FEE ITEM---------------------
      case 'backend/feeitem/index':
        _default.headline = sails.__('Fee Items');
        _default.description = sails.__('Fee Items');
        _default.actions = [
          {
            'title': sails.__('Add new'),
            'modal': '#modal-edit'
          }
        ];
        break; 
        
      //---------------------FEE INVOICE---------------------
      case 'backend/feeinvoice/index':
        _default.headline = sails.__('Fee Invoices');
        _default.description = sails.__('Fee Invoices');
        _default.actions = [
          {
            'title': sails.__('Add new'),
            'href': '/backend/feeinvoice/add'
          }
        ];
        break;
      
      //---------------------ADD FEE INVOICE---------------------
      case 'backend/feeinvoice/form':
        _default.headline = sails.__('Add Fee Invoices');
        _default.description = sails.__('Add Fee Invoices');
        break;
      
      //---------------------PAYMENT---------------------
      case 'backend/feeinvoice/statistic':
        _default.headline = sails.__('Payment Statistic');
        _default.description = sails.__('Payment Statistic');

        _default.isFilter = true;
        _default.filters.branchClass = true;
        _default.filters.status = true;
        break;
        
      //---------------------POST---------------------
      case 'backend/event/form':
        if(inputs.req.params.id) {
          _default.headline = sails.__('Edit event');
          _default.description = sails.__('Edit event');
        } else {
          _default.headline = sails.__('Add new event');
          _default.description = sails.__('Add new event');
        }
      break;
      case 'backend/event/list':
        _default.headline = sails.__('Events');
        _default.description = sails.__('Events');
        _default.actions = [
          {
            'title': sails.__('Add new'),
            'href': '/backend/event/add'
          }
        ];
      break;
      
      //---------------------FRONTEND LOGIN ---------------------
      case 'frontend/user/parent':
        _default.headline = sails.__('Login');
        _default.description = sails.__('Login');
        break;
      //---------------------FRONTEND ACCOUNT ---------------------
      case 'frontend/account/profile':
        _default.headline = sails.__('Account');
        _default.description = sails.__('Account');
        break;
      //---------------------FRONTEND TEACHER ---------------------
      case 'frontend/teacher/index':
        _default.headline = sails.__('Teachers');
        _default.description = sails.__('Teachers');
        break;
      
      //---------------------FRONTEND NEWS---------------------
      case 'frontend/news/index':
        _default.headline = sails.__('News');
        _default.description = sails.__('News');
        break;
      
      //---------------------FRONTEND NEWS DETAIL---------------------
      case 'frontend/news/detail':
        _default.headline = sails.__('News');
        _default.description = sails.__('News');
      break;
      
      //---------------------FRONTEND GALLERY---------------------
      case 'frontend/gallery/index':
        _default.headline = sails.__('Gallery');
        _default.description = sails.__('Gallery');
        break;
      
      //---------------------FRONTEND GALLERY DETAIL---------------------
      case 'frontend/gallery/detail':
        _default.headline = sails.__('Gallery');
        _default.description = sails.__('Gallery');
        break;
      
      //---------------------FRONTEND ABOUT US---------------------
      case 'frontend/aboutus/index':
        _default.headline = sails.__('About Us');
        _default.description = sails.__('About Us');
        break;
      
      //---------------------FRONTEND CONTACT---------------------
      case 'frontend/contact/index':
        _default.headline = sails.__('Contact');
        _default.description = sails.__('Contact');
        break;
      //---------------------FRONTEND NEWS ---------------------
      case 'frontend/news/index':
        _default.headline = sails.__('News');
        _default.description = sails.__('News');
      break;
      //---------------------FRONTEND SUBJECT ---------------------
      case 'frontend/subject/index':
        _default.headline = sails.__('Schedule');
        _default.description = sails.__('Schedule');
      break;
      //---------------------FRONTEND EVENT ---------------------
      case 'frontend/event/index':
        _default.headline = sails.__('Events');
        _default.description = sails.__('Events');
      break;
      //---------------------FRONTEND EVENT ---------------------
      case 'frontend/event/detail':
        _default.headline = sails.__('Event');
        _default.description = sails.__('Event');
      break;
  }
    return exits.success(_default);
  }
};
