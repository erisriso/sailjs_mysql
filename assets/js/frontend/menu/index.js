class IndexMenuFrontendEKP extends BaseBackendEKP {
    constructor() {
      super();
      this.initialize();
    }
  
    initialize() {
      let _this = this;
      _this.calendar = $('#calendar');
      
      _this.initCalendar();
      _this.onChangeClass();
    }
  
    initCalendar() {
      let _this = this;
      let _i18nMsg = i18n[_this.lang];
      let startCourseSession = moment(_this.calendar.attr('data-starttime')).format('YYYY-MM-DD');
      let endCourseSession = moment(_this.calendar.attr('data-endtime')).format('YYYY-MM-DD');
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
            let classId = _this.calendar.attr('data-classactive');
            jQuery.ajax({
              url: '/api/v1/backend/menu/search',
              type: 'GET',
              dataType: 'json',
              data: {
                classId: classId,
                start: startCourseSession,
                end: endCourseSession
              },
              success: function (doc) {
                // console.log('FullCalendar: ', doc)
                var events = [];
                if (!!doc) {
                  $.map(doc, function (r) {
                    for (let item of r) {
                      if (item) {
                        events.push({
                          title: item.title,
                          start: item.start
                        });
                      }
                    }
                  });
                }
                callback(events);
              }
            });
          }
        })
      }
    }
  
    onChangeClass() {
      let _this = this;
      $('.class-item').click((e) => {
  
        //update active class
        $('.class-item').removeClass('active');
        $(e.target).addClass('active');
  
        //change calander
        _this.calendar.attr('data-classactive', $(e.target).attr('data-classId'));
  
        //remove old data
        _this.calendar.fullCalendar('removeEvents');
        //Updating new events
        _this.calendar.fullCalendar('rerenderEvents');
        //getting latest Events
        _this.calendar.fullCalendar( 'refetchEvents' );
        //getting latest Resources
        _this.calendar.fullCalendar( 'refetchEventSources' );
      });
    }
  }