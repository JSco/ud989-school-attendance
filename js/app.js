(function() {
    var model, view, controller;

    model = {
        init: function() {
            if (!localStorage.attendance) {
                var nameColumns = $('tbody .name-col'),
                    attendance = {};

                console.log('Creating attendance records...');

                function getRandom() {
                    return (Math.random() >= 0.5);
                }

                nameColumns.each(function() {
                    var name = this.innerText;
                    attendance[name] = [];

                    for (var i = 0; i <= 11; i++) {
                        attendance[name].push(getRandom());
                    }
                });

                localStorage.attendance = JSON.stringify(attendance);
            }
        },
        getAttendanceObj: function() {
            return JSON.parse(localStorage.attendance);
        },
        setAttendance: function(obj) {
            localStorage.attendance = JSON.stringify(obj);
        }
    };

    controller = {
        init: function() {
            model.init();
            view.init();
        },
        countMissing: function() {
            var attendanceObj = this.getAttendanceRecords();

        },
        getAttendanceRecords: function() {
            return model.getAttendanceObj();
        },
        updateAttendance: function(newObj) {
            model.setAttendance(newObj);
            view.render();
        }
    };

    view = {
        init: function() {
            var attendance = controller.getAttendanceRecords(),
                $allCheckboxes = $('tbody input');

            // Check boxes, based on attendance records
            $.each(attendance, function(name, days) {
                var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
                    dayChecks = $(studentRow).children('.attend-col').children('input');

                dayChecks.each(function(i) {
                    $(this).prop('checked', days[i]);
                });
            });

            // When a checkbox is clicked, update localStorage
            $allCheckboxes.on('click', function() {
                var studentRows = $('tbody .student'),
                    newAttendance = {};

                studentRows.each(function() {
                    var name = $(this).children('.name-col').text(),
                        $allCheckboxes = $(this).children('td').children('input');

                    newAttendance[name] = [];

                    $allCheckboxes.each(function() {
                        newAttendance[name].push($(this).prop('checked'));
                    });
                });

                controller.updateAttendance(newAttendance);
            });

            this.render();
        },
        render: function() {
            var $allMissed = $('tbody .missed-col');

            $allMissed.each(function() {
                var studentRow = $(this).parent('tr'),
                    dayChecks = $(studentRow).children('td').children('input'),
                    numMissed = 0;

                dayChecks.each(function() {
                    if (!$(this).prop('checked')) {
                        numMissed++;
                    }
                });

                $(this).text(numMissed);
            });
        }
    };

    controller.init();

})();