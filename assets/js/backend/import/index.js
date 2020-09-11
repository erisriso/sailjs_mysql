class IndexFormImportBackendEKP extends BaseBackendEKP {
    constructor() {
      super( );
      this.initialize();
    }
  
    initialize() {
      //DO NOT LOAD UNNESSESARY CLASS
      //Init form + list if page have BOTH  
      this.form = new FormIndexImportBackendEKP(this);
    }
  }
  
  class FormIndexImportBackendEKP {
    constructor(opts) {
      _.extend(this, opts);
      this.formId = 'formImport';
      this.formObj = $('#' + this.formId);
      this.headline = this.formObj.closest('.panel').find('.panel-title');
      this.alert = this.formObj.closest('.panel').find('.alert');
      this.btnSubmit = this.formObj.find('button[type="submit"]');
      this.btnReset = this.formObj.find('button[type="reset"]');
      this.i18n = i18n[this.lang];
      this.initialize();
    }
  
    initialize() {
      let _this = this;
      _this.initUploadFile();
      _this.initFilter();
    }
  
    initUploadFile() {
      
      let _this = this;
      let inputFiles = _this.formObj.find('[type=file]');
      if (inputFiles.length) {
        if (_this.uploadedFiles == undefined) {
          _this.uploadedFiles = {};
        }
        let value = $('input').val();
        inputFiles.each((i, input) => {
          $(input).on('change', (e) => {
            let _classObj = $('#filterClass').val();
            if (!_classObj) {
              swal(_this.i18n['Please choose class to import'], {
                icon: "warning",
                button: false,
              });
            } else {
              let _file = e.currentTarget.files[0];
              let _data = {
                file: _file,
                classObj: _classObj,
                _csrf: window.SAILS_LOCALS._csrf
              }
              Cloud.importStudentExcel.with(_data).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
                    if (err) {
                      console.log(err);
                      let title = _this.messages.cannotImport;
                      if (err.responseInfo.body.code == 'STUDENT_ERROR_IMPORT') title = _this.messages.error + ', ' + err.responseInfo.body.message;
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
                        window.location.replace('/backend/class-' + _data.classObj +'/student');
                        })
                    }
              })    
            }

          });
        });
      }
    }

    initFilter() {
      let _this = this;
      $('.js-select2-branch').on('change', (e) => {
        e.preventDefault();
        let branchID = $(".js-select2-branch option:selected").val()
        $.ajax({
          type: "GET",
          url: "/api/v1/backend/branch/get/" + branchID,
          dataType: "json",
          success: function (data) {
            //data will hold an object with your response data, no need to parse
            $('#filterClass')
              .find('option')
              .remove()
              .end();
            var option = '';
            for (let classes of data.classes) {
              option += '<option value="' + classes.id + '">' + classes.title + '</option>';
            }
            $('#filterClass').append(option);
          }
        })
      });
    }
  }
  
  