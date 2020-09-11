

class IndexListScheduleBackendEKP extends BaseBackendEKP {
  constructor() {
    super();
    this.initialize();
  }

  initialize() {
    let _this = this;
    _this.countSlot = 1;
    _this.calendar = $('#calendar');
    _this.modalSchedule = $('#modalSchedule');
    _this.originalModal = $('#modalSchedule').clone();
    _this.initCalendar();
    _this.initTimePicker();
    // _this.initDatePicker();
    _this.initDateRangePicker();
    _this.initRepeater();
    _this.handlerAddButton();
    _this.submitFormShedule();
    _this.initDeleteSchedule();
    _this.alert = _this.modalSchedule.find('.alert');
    $('.js-height-scrollbar').perfectScrollbar();
    $('.js-process-basic-multiple').select2({width: '100%'});

    _this.dateUseStart = moment().format("YYYY-MM-DD");
    _this.dateUseEnd = moment().add(7,'days').format("YYYY-MM-DD");
  }

  handlerAddButton() {
    $('#btnAdd').on('click', () => {
      $('.modal-title').find('.txtAdd').attr("hidden", false);
      $('.modal-title').find('.txtUpdate').attr("hidden", true);
      $('#submitFormShedule').find('.btnAdd').attr("hidden", false);
      $('#submitFormShedule').find('.btnUpdate').attr("hidden", true);
      // $('#singleDay').attr("hidden", true);
      $('#multipleDay').attr("hidden", false);
      $('#deleteSchedule').attr("hidden", true);
    })
  }


  submitFormShedule() {
    let _this = this;
    let _i18nMsg = i18n[_this.lang];

    $('#submitFormShedule').on('click', () => {
      let manner = _this.modalSchedule.attr('data-manner');
      // prepare data
      let temp = {};
      temp.classId = $('#modalSchedule').attr('data-classactive');
      if (_this.dateUseStart != '' && _this.dateUseStart != '') {
        temp.dateUse = moment($('#dateSchedule').val(), "DD/MM/YYYY").format("YYYY-MM-DD");
        // temp.dateUseStart = moment($('#dateScheduleStart').val(), "DD/MM/YYYY").format("YYYY-MM-DD");
        // temp.dateUseEnd = moment($('#dateScheduleEnd').val(), "DD/MM/YYYY").format("YYYY-MM-DD");
        temp.dateUseStart = _this.dateUseStart;
        temp.dateUseEnd = _this.dateUseEnd;
        temp.slotSubjects = $('.repeater').repeaterVal().slotSubjects;
        if (temp.slotSubjects) {
          //check data slot subject empty
          let isValid = true;
          let oFormData = $('.repeater').serializeArray();
          for (let iIndex in oFormData) {
            if (!oFormData[iIndex].name.includes('topic') && oFormData[iIndex].name != 'dateSchedule'  && (oFormData[iIndex].value == '' || oFormData[iIndex].value == 0)) { isValid = false; }
          }
          if (isValid) {
            temp._csrf = window.SAILS_LOCALS._csrf;
            if (manner == 'add') {
              // temp.repeat = false;
              // if ($('.repeat').is(":checked")) temp.repeat = true;
              temp.repeat = true; //default is repeat each week
              temp.daysOnWeek = $('#daysOnWeek').val();
              if (Array.isArray(temp.daysOnWeek) && temp.daysOnWeek.length != 0) {
                // ADD SCHEDULE
                console.log('addSchedule: ', $('.repeater').repeaterVal());
                Cloud.addSchedule.with(temp).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
                  if (err) {
                    console.log(err);
                    return;
                  } else {
                    if (responseBody.code == 'SCHEDULE_EXISTED') {
                      _this.alert.removeClass('hidden alert-success').addClass("alert-danger").html(_i18nMsg["Schedule existed"]);
                    } else {
                      _this.alert.removeClass('hidden alert-danger').addClass("alert-success").html(_this.messages.addSuccess);
                      $('#calendar').fullCalendar('refetchEvents');
                      $('.modal').on('hidden.bs.modal', function () {
                        $('#modalSchedule').remove();
                        let myClone = _this.originalModal.clone();
                        $('.container-fluid').append(myClone);
                        _this.initialize();
                      });
                    }
                  }
                })
              } else {
                _this.alert.removeClass('hidden alert-success').addClass("alert-danger").html( _i18nMsg["Day of week is not empty"] );
              }
            } else if (manner == 'edit') {
              // EDIT SCHEDULE
              console.log('Edit Schedule: ', $('.repeater').repeaterVal());
              Cloud.editSchedule.with(temp).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
                if (err) {
                  console.log(err);
                  return;
                } else {
                  _this.alert.removeClass('hidden alert-danger').addClass("alert-success").html(_this.messages.editSuccess);
                  $('#calendar').fullCalendar('refetchEvents');
                  $('.modal').on('hidden.bs.modal', function () {
                    $('#modalSchedule').remove();
                    let myClone = _this.originalModal.clone();
                    $('.container-fluid').append(myClone);
                    _this.initialize();
                  });
                }
              })
            }
          } else {
            _this.alert.removeClass('hidden alert-success').addClass("alert-danger").html(_this.messages.dataInvalid);
          }
        } else {
          _this.alert.removeClass('hidden alert-success').addClass("alert-danger").html( _i18nMsg["Time and subject must not empty"] );
        }
      } else {
        _this.alert.removeClass('hidden alert-success').addClass("alert-danger").html( _i18nMsg["Please select a date"] );
      }
    })
  }

  handlerEditEventsByDate(data) {
    let _this = this;
    let _i18nMsg = i18n[_this.lang];
    let dataSchedule = data.schedule;
    let listSubjects = data.listSubjects;
    _this.modalSchedule.on('show.bs.modal', function (e) {
      console.log('show');
      let renderListSubject = '';
      _this.countSlot = dataSchedule.slotSubjects.length + 1;
      // render html & select subject
      for (let i = 0; i < dataSchedule.slotSubjects.length; i++) {
        // render list subjects for tag select
        let sujeId = [];
        let htmlOption = '';
        if (listSubjects.length > 0) {
          _.each(listSubjects, function (suje, idx) {
            sujeId.push(suje.id);
          });
        }
        _.each(listSubjects, function (suje, idx) {
          htmlOption += `<option value="${suje.id}" ${suje.id == dataSchedule.slotSubjects[i].subject ? 'selected' : ''}>${suje.title}</option>`
        });
        renderListSubject +=
          `<div data-repeater-item class="row" style="">
              <div class="col-3">
                <div class="form-group">
                  <label>`+ _i18nMsg["Time"] + `</label>
                  <div class="input-group date timeShedule" data-target-input="nearest" id="timeSchedule${i}" data-target="#timeSchedule${i}">
                  <div class="input-group timeShedule" data-target="#timeSchedule${i}" data-toggle="datetimepicker" id="timeSchedule${i}">
                      <input type="text" name="slotSubjects[${i}][time]" class="form-control bootstrap-datetimepicker-input" id="timeSchedule${i}" data-target="#timeSchedule${i}" 
                      value="${dataSchedule.slotSubjects[i].time}">
                      <div class="input-group-addon input-group-append">
                        <i class="mdi mdi-clock input-group-text"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group">
                  <label class="form-control-label">`+ _i18nMsg["Subject"] + `</label>
                  <select class="form-control" id="subject" name="slotSubjects[${i}][subject]">
                    <option value="0">`+ _i18nMsg["Select"] + `</option>
                    ${htmlOption}
                  </select>
                </div>
              </div>
              <div class="col-4">
                <div class="form-group">
                  <label class="form-control-label">`+ _i18nMsg["Topic"] + `</label>
                  <input type='text' id="topic" name="slotSubjects[${i}][topic]" class="form-control" value="${dataSchedule.slotSubjects[i].topic ? dataSchedule.slotSubjects[i].topic : '' }"/>
                </div>
              </div>
              <div class="col-2 d-flex align-items-center">
                <button data-repeater-delete="" type="button" class="btn btn-danger btn-sm icon-btn ml-2">
                  <i class="mdi mdi-delete"></i>
                </button>
              </div>
            </div>`
      }
      $('.slotSubjects').empty();
      $('.slotSubjects').append(renderListSubject);
      // create date time picker
      // for (let i = 0; i < dataSchedule.slotSubjects.length; i++) {
      //   $('#timeSchedule' + i).datetimepicker({
      //     format: 'HH:mm',
      //     icons: {
      //       up: "mdi mdi-arrow-up",
      //       down: "mdi mdi-arrow-down"
      //     },
      //     //enabledHours: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      //     stepping: 15,
      //   });
      // }
      _this.initTimePicker();
      // render time
      _.each(dataSchedule, (value, key) => {
        if (key == 'dateUse') {
          _this.modalSchedule.find('[name="dateSchedule"]').val(moment(value, "YYYY-MM-DD").format("DD/MM/YYYY"));
          $('#dateSchedule').prop('readonly', true);
        }
      });
    });
    _this.modalSchedule.on('hide.bs.modal', function (e) {
      $('#modalSchedule').remove();
      let myClone = _this.originalModal.clone();
      $('.container-fluid').append(myClone);
      _this.initialize();
    });
    _this.modalSchedule.modal('show');
  }

  initCalendar() {
    let _this = this;
    let _i18nMsg = i18n[_this.lang];
    let startCourseSession = moment($('#modalSchedule').attr('data-starttime')).format('YYYY-MM-DD');
    let endCourseSession = moment($('#modalSchedule').attr('data-endtime')).format('YYYY-MM-DD');
    let classId = _this.calendar.attr('data-classactive');
    if (_this.calendar.length) {
      _this.calendar.fullCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,basicWeek,basicDay'
        },
        defaultView: 'basicWeek',
        defaultDate: moment().format("YYYY-MM-DD"),
        //format for view basicDay & basicWeek
        views: {
          basicWeek: {
            columnFormat: 'ddd D/M',
            titleFormat: 'DD MMM,YYYY'
          },
          basicDay: {
            titleFormat: 'DD MMM,YYYY'
          }
        },
        navLinks: true, // can click day/week names to navigate views
        editable: false,
        eventResizableFromStart: true,
        eventLimit: true, // allow "more" link when too many events
        monthNames: [ _i18nMsg['January'],_i18nMsg['February'],_i18nMsg['March'],_i18nMsg['April'],_i18nMsg['May'],_i18nMsg['June'],_i18nMsg['July'],_i18nMsg['August'],_i18nMsg['Septemper'],_i18nMsg['October'],_i18nMsg['November'],_i18nMsg['December']],
        monthNamesShort: [ _i18nMsg['Jan'],_i18nMsg['Feb'],_i18nMsg['Mar'],_i18nMsg['Apr'],_i18nMsg['_May'],_i18nMsg['Jun'],_i18nMsg['Jul'],_i18nMsg['Aug'],_i18nMsg['Sep'],_i18nMsg['Oct'],_i18nMsg['Nov'],_i18nMsg['Dec']],
        dayNames: [ _i18nMsg['Sunday'],_i18nMsg['Monday'],_i18nMsg['Tuesday'],_i18nMsg['Wednesday'],_i18nMsg['Thursday'],_i18nMsg['Friday'],_i18nMsg['Saturday']],
        dayNamesShort: [_i18nMsg['Sun'],_i18nMsg['Mon'],_i18nMsg['Tue'],_i18nMsg['Wed'],_i18nMsg['Thu'],_i18nMsg['Fri'],_i18nMsg['Sat']],
        timeFormat: 'H:mm',
        events: function (start, end, timezone, callback) {
          jQuery.ajax({
            url: '/api/v1/backend/schedule/search',
            type: 'GET',
            dataType: 'json',
            data: {
              classId: classId,
              start: startCourseSession,
              end: endCourseSession
            },
            success: function (doc) {
              console.log('FullCalendar: ', doc)
              var events = [];
              if (!!doc) {
                $.map(doc, function (r) {
                  for (let item of r) {
                    if (item) {
                      events.push({
                        title: item.title,
                        start: item.start,
                        topic: item.topic
                      });
                    }
                  }
                });
              }
              callback(events);
            }
          });
        },
        eventRender: function (event, element) { 
          if (event.topic && event.topic != '') {
            element.find('.fc-title').append("<br/>(" + event.topic + ')'); 
          }
        },
        dayClick: function (date, jsEvent, view) {
          let params = {};
          params.courseSession = _this.modalSchedule.attr('data-coursesession');
          params.classId = _this.modalSchedule.attr('data-classactive');
          params.dateUse = date.format();
          $('#dateSchedule').val(date.format('DD/MM/YYYY'));
          // GET SCHEDULE BY DATE
          Cloud.getSchedule.with(params).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
            if (err) {
              swal(`${moment(date.format(), "YYYY-MM-DD").format("DD/MM/YYYY")} ` + _i18nMsg["have no schedule. Please add new"], {
                icon: "warning",
                button: false,
              });
            } else {
              console.log(responseBody);
              _this.modalSchedule.attr('data-manner', 'edit');
              _this.modalSchedule.attr('data-scheduleId', responseBody.schedule.id );
              // CHANGE TEXT
              $('.modal-title').find('.txtAdd').attr("hidden", true);
              $('.modal-title').find('.txtUpdate').attr("hidden", false);
              $('#submitFormShedule').find('.btnAdd').attr("hidden", true);
              $('#submitFormShedule').find('.btnUpdate').attr("hidden", false);
              // $('#singleDay').attr("hidden", false);
              $('#multipleDay').attr("hidden", true);
              $('#sectionForCreate').attr("hidden", true);
              $('#deleteSchedule').attr("hidden", false);
              _this.handlerEditEventsByDate(responseBody);
            }
          });
        }
      })
    }
  }

  // initTimePicker(element, idx) {
  //   let timeScheduleItem = 'timeSchedule';
  //   if (idx) {
  //     timeScheduleItem += idx;
  //     element.find(".timeShedule").attr('id', timeScheduleItem);
  //     element.find(".timeShedule").attr('data-target', '#' + timeScheduleItem);
  //     element.find(".datetimepicker-input").attr('id', timeScheduleItem);
  //     element.find(".datetimepicker-input").attr('data-target', '#' + timeScheduleItem);
  //     if ($('#' + timeScheduleItem).length) {
  //       // $('#' + timeScheduleItem).datetimepicker({
  //       //   format: 'HH:mm',
  //       //   icons: {
  //       //     up: "mdi mdi-arrow-up",
  //       //     down: "mdi mdi-arrow-down"
  //       //   },
  //       //   enabledHours: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  //       //   // stepping: 15,
  //       // });
  //       $('#' + timeScheduleItem).bootstrapMaterialDatePicker({
  //         date: false,
  //         format: 'HH:mm'
  //       });
  //     }
  //   } else {
  //     $(".timeShedule").attr('id', timeScheduleItem);
  //     $(".timeShedule").attr('data-target', '#' + timeScheduleItem);
  //     $(".datetimepicker-input").attr('id', timeScheduleItem);
  //     $(".datetimepicker-input").attr('data-target', '#' + timeScheduleItem);
  //     if ($('#' + timeScheduleItem).length) {
  //       // $('#' + timeScheduleItem).datetimepicker({
  //       //   format: 'HH:mm',
  //       //   icons: {
  //       //     up: "mdi mdi-arrow-up",
  //       //     down: "mdi mdi-arrow-down"
  //       //   },
  //       //   enabledHours: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  //       //   // stepping: 15,
  //       // });
  //       $('#' + timeScheduleItem).bootstrapMaterialDatePicker({
  //         date: false,
  //         format: 'HH:mm'
  //       });
  //     }
  //   }
  // }

  initTimePicker() {
    $('.bootstrap-datetimepicker-input').bootstrapMaterialDatePicker({
      date: false,
      format: 'HH:mm',
      switchOnClick: true
    });
  }

  // initDatePicker() {
  //   //init datepicker
  //   let inpDate = $('.dateAddSchedule input');
  //   let dateVal = $('.dateAddSchedule input').val();
  //   let curDate = moment().format("DD/MM/YYYY");
  //   inpDate.datepicker({
  //     format: 'dd/mm/yyyy',
  //     todayHighlight: true,
  //     orientation: 'bottom right',
  //     autoclose: true
  //   }).datepicker('setDate', dateVal ? dateVal : curDate).on("changeDate", function (e) {
  //     console.log("hihi" + inpDate.val());
  //   });
  // }

  initDateRangePicker() {
    let _this = this;
    $('input[name="duration"]').daterangepicker({
      locale: {
        "format": "DD/MM/YYYY"
      },
      minDate: moment(),
      startDate: moment(),
      endDate: moment().add(7,'days'),
    }, function (start, end, label) {
      _this.dateUseStart = start.format('YYYY-MM-DD');
      _this.dateUseEnd = end.format('YYYY-MM-DD');
      console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
    });
  }

  initRepeater() {
    let _this = this;
    $('.repeater').repeater({
      defaultValues: {
        'text-input': 'foo'
      },
      show: function () {
        $(this).slideDown();
        $(this).find(".datetimepicker-input").attr('id', "timeSchedule" + _this.countSlot)
        // _this.initTimePicker($(this), _this.countSlot);
        _this.initTimePicker();
        _this.countSlot++;
        $(".js-height-scrollbar").animate({ scrollTop: $('.js-height-scrollbar')[0].scrollHeight}, 1000);//.scrollTop( $( ".js-height-scrollbar" )[0].scrollHeight );//
        $(".js-height-scrollbar").perfectScrollbar('update');
      },
      hide: function (deleteElement) {
        _this.initSweetAlert($(this), deleteElement);
      },
      isFirstItemUndeletable: true
    });
  }

  initSweetAlert(element, deleteElement) {
    swal({
      title: this.messages.deletePopup,
      icon: 'warning',
      cancelButtonColor: '#ff4081',
      buttons: {
        cancel: {
          text: this.messages.cancel,
          value: null,
          visible: true,
          className: "btn btn-danger",
          closeModal: true,
        },
        confirm: {
          text: "OK",
          value: true,
          visible: true,
          className: "btn btn-primary",
          closeModal: true
        }
      }
    }).then((value) => {
      if (value) {
        element.slideUp(deleteElement);
      }
    });
  }

  initDeleteSchedule() {
    let _this = this;
    $('#deleteSchedule').on('click', () => {
      let id = _this.modalSchedule.attr('data-scheduleId');
      swal({
        title: this.messages.deletePopup,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3f51b5',
        cancelButtonColor: '#ff4081',
        confirmButtonText: 'Great ',
        buttons: {
          cancel: {
            text: this.messages.cancel,
            value: null,
            visible: true,
            className: "btn btn-danger",
            closeModal: true,
          },
          confirm: {
            text: "OK",
            value: true,
            visible: true,
            className: "btn btn-primary",
            closeModal: true
          }
        }
      }).then((value) => {
        if (value) {
          Cloud.deleteSchedule.with({ id: id, _csrf: window.SAILS_LOCALS._csrf }).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
            if (err) {
              console.log(err);
              return;
            } else if (responseBody) {
              swal({
                title: this.messages.deleteSuccessfully,
                icon: 'success',
                button: {
                  text: this.messages.continue,
                  value: true,
                  visible: true,
                  className: "btn btn-primary"
                }
              }).then((value) => {
                //THEN RELOAD PAGE IF NEEDED 
                location.reload();
              })
            }
          })
        }
      });
    });
  }
}