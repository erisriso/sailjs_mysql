class IndexFormImportParentBackendEKP extends BaseBackendEKP {
    constructor() {
      super( );
      this.initialize();
    }
  
    initialize() {
      //DO NOT LOAD UNNESSESARY CLASS
      //Init form + list if page have BOTH  
      this.form = new FormIndexImportParentBackendEKP(this);
    }
  }
  
  class FormIndexImportParentBackendEKP {
    constructor(opts) {
      _.extend(this, opts);
      this.formId = 'formImportParent';
      this.formObj = $('#' + this.formId);

      this.headline = this.formObj.find('.panel-title');
      this.alert = this.formObj.find('.alert');
      this.btnSubmit = this.formObj.find('button[type="submit"]');
      this.btnReset = this.formObj.find('button[type="reset"]');
  
      this.initialize();
    }
  
    initialize() {
      let _this = this;
      _this.initUploadFile();
    }
  
    initUploadFile() {
      
      let _this = this;
      let inputFiles = _this.formObj.find('[type=file]');
      let _classObj = _this.formObj.attr('data-class');
      if (inputFiles.length) {
        if (_this.uploadedFiles == undefined) {
          _this.uploadedFiles = {};
        }
        let value = $('input').val();
        inputFiles.each((i, input) => {
          $(input).on('change', (e) => {
            let _file = e.currentTarget.files[0];
            let _data = {
              file: _file,
              classObj: _classObj,
              _csrf: window.SAILS_LOCALS._csrf
            }
            Cloud.importParentExcel.with(_data).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
              if (err) {
                console.log(err);
                let title = _this.messages.cannotImport;
                if (err.responseInfo.body.code == 'PARENT_ERROR_IMPORT') title = _this.messages.error + ', ' + err.responseInfo.body.message;
                swal({
                  title: title,
                  icon: 'error',
                  button: {
                   text: _this.messages.continue,
                    value: true,
                    visible: true,
                    className: "btn btn-primary"
                  }
                  }).then((value) => {
                  //THEN RELOAD PAGE IF NEEDED 
                  window.location.reload();
                  })
              } else {
                //save thumb data to object uploadedFiles
                console.log(responseBody);
                _this.uploadedFiles = responseBody;
                swal({
                  title: _this.messages.importSuccessfully,
                  icon: 'success',
                  button: {
                   text: _this.messages.continue,
                    value: true,
                    visible: true,
                    className: "btn btn-primary"
                  }
                  }).then((value) => {
                  //THEN RELOAD PAGE IF NEEDED 
                  window.location.replace('/backend/class-' + _data.classObj +'/parent');
                  })
              }
                  
            })
          });
        });
      }
    }
  }
  
  