class IndexListParentBackendEKP extends BaseBackendEKP {
  constructor() {
    super();
    this.initialize();
  }

  initialize() {
    //DO NOT LOAD UNNESSESARY CLASS
    //Init form + list if page have BOTH  
    this.list = new ListIndexParentBackendEKP(this);
  }
}

class ListIndexParentBackendEKP {
  constructor(opts) {
    _.extend(this, opts);
    this.langUrl = this.lang == 'en' ? '' : '/js/backend/datatable.json';
    this.i18n = i18n[this.lang];
    this.tblId = 'tblParent';
    this.tableObj = $('#' + this.tblId);
    if (this.tableObj.length) {
      this.checkAll = null;
      this.listChecked = '';
      
      this.initialize();
    }
  }
  initialize() {
    let _this = this;
    _this.initDataTable();
    _this.handleItemActions();
    _this.initMoreAction();
    _this.initCheckAll();
    _this.handleBranch();
  }

  initDataTable() {
    let _this = this;
    let params = {};
    let searchParams = new URLSearchParams(window.location.search);
    params.classId = _this.tableObj.attr('data-classActive');
    params.status = searchParams.get('status') || '2';
    params.branchId = searchParams.get('branchId') || '';
    $(".js-select2-branch").val(params.branchActive).change();
    $(".js-select2-status").val(params.status).change();
    //cloud success  
    var table = this.tableObj.DataTable({
      "language": {
        "url": this.langUrl
      },
      "processing": true,
      "serverSide": true,
      "ajax": "/api/v1/backend/parent/list/search?status=" + params.status + "&classId=" + params.classId + "&branchId=" + params.branchId,
      //Add column data (JSON) mapping from AJAX to TABLE
      "columns": [
        { "data": "id" },
        { "data": "fullName" },
        { "data": "emailAddress" },
        { "data": "phone" },
        { "data": "relationships" },
        { "data": "status" },
        { "data": "tool" },
      ],
      //Define first column without order
      columnDefs: [
        { "orderable": false, "targets": [0, -4, -3, -2, -1] }
      ],
      "order": [[1, "asc"]],
      "iDisplayLength": 10,
      "aLengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
      //"buttons": ['copy', 'excel', 'csv', 'pdf', 'print'],
      "pagingType": "numbers",
      //"sDom": "<'row'<'col-sm-6'><'col-sm-6 mb-10'B>>" + "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
      //"sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
      "bDestroy": true,
      "initComplete": function (settings, json) {
        _this.initCheckedList();
        _this.initSwitchStatus();
      },

      //export excel and pdf
      "dom": 'Bfrtip',
      "buttons": [
      {
          "className" : 'btn btn-success mb-20',
          "text": 'Xuất danh sách Excel',
          "extend": 'excelHtml5',
          "filename" : 'DANH SÁCH PHỤ HUYNH ' + _this.tableObj.attr('data-classActiveTitle').toUpperCase(),
          "title": 'DANH SÁCH PHỤ HUYNH ' + _this.tableObj.attr('data-classActiveTitle').toUpperCase(),
          "exportOptions": {
            "columns": [ 1, 2, 3, 4 ] // export with specificed columns
          }
      },
      {
          "className" : 'btn btn-success mb-20',
          "text": 'Xuất danh sách PDF',
          "extend": 'pdfHtml5',
          "filename" : 'DANH SÁCH PHỤ HUYNH ' + _this.tableObj.attr('data-classActiveTitle').toUpperCase(),
          "title": 'DANH SÁCH PHỤ HUYNH ' + _this.tableObj.attr('data-classActiveTitle').toUpperCase(),
          "exportOptions": {
            "columns": [ 1, 2, 3, 4 ] // export with specificed columns
          }
      }],
    });
    $(".js-select2-branch").val(params.branchId).change();
    $(".js-select2-class").val(params.classId).change();
    $(".js-select2-status").val(params.status).change();
    
    // Onclick event to query data by Branch
    $('#filterBtn').on('click', (e) => {
      e.preventDefault();
      let branchID = $(".js-select2-branch option:selected").val()
      let classID = $(".js-select2-class option:selected").val()
      let status = $(".js-select2-status option:selected").val() 
      _this.routingPrepare(branchID, classID,status);
    })
  }
  handleBranch() {
    let _this = this;
    $('.js-select2-branch').on('change', (e) => { 
      e.preventDefault();
      let branchID = $(".js-select2-branch option:selected").val()
      $.ajax({
        type: "GET",
        url: "/api/v1/backend/branch/get/"+ branchID,
        dataType: "json",
        success: function (data) {
          //data will hold an object with your response data, no need to parse
          $('#filterClass')
            .find('option')
            .remove()
            .end();
          var option = '';
          option += '<option value="0">' + _this.i18n['All Class'] + '</option>';
          for (let classes of data.classes){
            option += '<option value="'+ classes.id + '">' + classes.title + '</option>';
          }
          $('#filterClass').append(option);
        }
      })
    })
  }
  routingPrepare(branchId,classId,status) {
    let _this = this;
    const opts = [
      {'value':'/backend/parent/filter?branchId=' + branchId + '&classId='+ classId + '&status=' + status, 'text':'Branch'}
    ];
      window.location = opts[0].value;
  }
  handleItemActions() {
    let _this = this;
    // ONCLICK REMOVE (TRASH) LINK
    _this.tableObj.on('click', '.remove-row', function (e) {
      let id = $(this).attr('data-id');
      _this.initSweetAlert(id);
    });
  }

  initMoreAction() {
    let _this = this;
    let btnTrash = $('.dropdown-menu .act-trash-group');

    btnTrash.on('click', (e) => {
      e.preventDefault();
      let ids = '';
      if (_this.checkAll.value != '') {
        ids = _this.checkAll.value;
        _this.initSweetAlert(ids);
      } else if(_this.listChecked != '') { 
        ids = _this.listChecked.slice(0, -1);
        _this.initSweetAlert(ids);
      } else {
        swal(_this.messages.chooseItem);
      }
    });
  }

  initCheckAll() {
    this.checkAll = new CheckBoxBackendEKP({
      isChkAll: true,
      selector: '#js-check-all',
      childSelector: '.js-checkbox-item',
      onChange: function (e, value) {
        console.log("===========================ONCHANGE SELECT ELEMENT============================");
        console.log(value);
      }
    });
  }

  initCheckedList() {
    let _this = this;
    $('.js-checkbox-item').on("click", (e) => {
      let target = _this.getEventTarget(e);
      if (target.checked) {
        _this.listChecked = _this.listChecked + target.defaultValue + ';';
        console.log('_this.listChecked', _this.listChecked);
      } else {
        let str = target.defaultValue + ';';
        let result = _this.listChecked.replace(str, '');
        _this.listChecked = result;
        console.log('_this.listChecked', _this.listChecked);
      }
    });
  }
  //GET TARGET
  getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
  }
  //END GET TARGET

  initSweetAlert(id) {
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
        Cloud.trashParent.with({ ids: id,  _csrf: window.SAILS_LOCALS._csrf }).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
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
							//THEN RELOAD TABLE
							window.curBackendEKP.list.initDataTable();
            })
          }
        })
      }
    });
  }

	initSwitchStatus() {
		// let _this = this;
		$(document).ready(function () {
			$('.switchStatus').change(function () {
				let id = $(this).attr('data-id');
        // _this.initSwitchStatusAlert(id);
        Cloud.switchStatusParent.with({ id: id,  _csrf: window.SAILS_LOCALS._csrf }).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
					if (err) {
						console.log(err);
						return;
					} else if (responseBody) {
            //THEN RELOAD TABLE
            window.curBackendEKP.list.initDataTable();
					}
				})
			});
		});
	}

}