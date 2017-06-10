$(function() {
    var utSearchModule = {
        init: function() {
            this.cacheDom();
            this.getData();
            this.addOptions();
            this.bindEvents();
            this.showSearchResult(this.dataArr);

            if (this.isMobile()) {
                this.$searchSection.addClass('ut-m');
            } else {
                this.$searchSection.removeClass('ut-m');
            }
        },
        isMobile: function() {
            var checked;
            if (navigator.userAgent.match(/iPad|iPhone|Android|BlackBerry|webOS|Mobile/i)) {
                checked = true;
            } else {
                checked = false;
            }
            return checked;
        },
        cacheDom: function() {
            this.$searchSection = $('#utFundSearch');
            this.$table = $('.ut-fundsearch-table');
            this.$list = $('#utListBody');
            this.toggleViewId = $('#toggleView a.toggle.on').attr('data-target');
            this.$elmHide = $('#toggleView a.toggle:not(.on)').attr('data-target');
            this.isList = $('#' + this.$elmHide).parent().is('table');
            this.$toggleView = $('#toggleView a.toggle');
            this.$pager = $('.pagination');
            this.$countLegend = $("#legend");
            this.$toggleFilter = $('.filter-subCtrls');
            this.$mToggleFilter = $('h3.m-toggle');
            this.$toggleBtn = $('.toggle-filter a');
            this.$textShowMore = this.$toggleBtn.attr('data-showmore');
            this.$textShowLess = this.$toggleBtn.attr('data-showless');
            this.$sortTable = $('.ut-fundsearch-table th.sort');
            this.$sortList = $('.ut-fundsearch-table a.sort');
            this.$selectBox = $('.ut-select');
            this.$filterFocusFunds = $('#utFilterFocusFunds');
            this.$lightboxOverlay = $('.ut-lightbox-overlay');
            this.$lightBoxCloseBtn = $('.ut-lightbox-closebtn');
            this.dataArr = [];
            this.renderArr = this.dataArr;
            this.filterObj = {};
        },
        getData: function() {
            for (var i in utData.fundList) {
                this.dataArr.push(utData.fundList[i]);
            }
            this.dataArr.sort(function(a, b) {
                return parseInt(b['percentage']) - parseInt(a['percentage']);
            });
        },
        addOptions: function() {
            this.$selectBox.find('select').each(function() {
                utSearchModule.bindSelectOptions($(this));
            });
        },
        bindSelectOptions: function(el) {
            var optionArr = [],
                $elId = el.attr('id'),
                returnArr = {},
                i = 0;

            $.each(this.dataArr, function(key, val) {
                if (val.hasOwnProperty($elId)) optionArr.push(val[$elId]);
            });

            var returnArr = this.removeDupilcates(optionArr);

            for (i; i < el.length; i++) {
                var _this = el[i];

                $.each(returnArr, function(key, val) {
                    el.append($('<option >', {
                        value: key
                    }).text(key));
                });
            }

            returnArr = {};
            optionArr.length = 0;

        },
        removeDupilcates: function(arr) {
            var tempObj = {},
                returnArr = [],
                j = 0;

            $.each(arr, function(key, val) {
                tempObj[val] = j;
                j++;
            });

            $.each(tempObj, function(key, val) {
                returnArr.push(key);
            });

            return tempObj;
        },
        bindEvents: function() {
            this.$toggleBtn.on('click', function(e) {
                e.preventDefault();

                if (utSearchModule.$toggleFilter.is(':hidden')) {
                    utSearchModule.$toggleBtn.fadeOut(200, function() {
                        $(this).text(utSearchModule.$textShowLess).fadeIn(200);
                    });

                    utSearchModule.$toggleFilter.slideDown(400);
                } else {
                    utSearchModule.$toggleBtn.fadeOut(200, function() {
                        $(this).text(utSearchModule.$textShowMore).fadeIn(200);
                    });
                    utSearchModule.$toggleFilter.slideUp(400);
                }
            });

            this.$toggleView.on('click', function(e) {
                e.preventDefault();

                var iconOn = $(this).hasClass('on');

                if (!iconOn) {
                    utSearchModule.$toggleView.removeClass('on');
                    $(this).addClass('on');

                    utSearchModule.$elmHide = $('#toggleView a.toggle:not(.on)').attr('data-target');
                    utSearchModule.isList = $('#' + utSearchModule.$elmHide).parent().is('table');

                    if (utSearchModule.$elmHide === 'utListBody') {
                        $('#toggleView').addClass('showTable');
                    } else {
                        $('#toggleView').removeClass('showTable');
                    }
                    
                    if (utSearchModule.$filterFocusFunds.is(':checked')) {
                        var _data = utSearchModule.sortFocusFunds(utSearchModule.renderArr);
                            utSearchModule.showSearchResult(_data);
                    } else {
                        utSearchModule.showSearchResult(utSearchModule.renderArr);
                    }
                    
                    utSearchModule.printListCount(utSearchModule.renderArr);
                } else {
                    return false;
                }
            });

            this.$searchSection.on('click', 'th.sort, a.sort', function() {
                var oKey = $(this).attr('data-key'),
                    oAsce = $(this).hasClass('sortAsce'),
                    oAlpha = $(this).hasClass('alpha'),
                    oNum = $(this).hasClass('num'),
                    oPercent = $(this).hasClass('percent'),
                    isTableSort = $(this).parent().is('tr');
                
                utSearchModule.$sortTable.removeClass('sortAsce sortDesc');
                utSearchModule.$sortList.removeClass('sortAsce sortDesc');

                if (!oAsce) {
                    if (oAlpha) {
                        utSearchModule.renderArr.sort(function(a, b) {
                            if (a[oKey] < b[oKey]) return -1;
                            if (a[oKey] > b[oKey]) return 1;

                            return a[oKey] < b[oKey];
                        });
                        $('.ut-sortPrecent').removeClass('sortAsce sortDesc');
                    } else if (oNum || oPercent) {
                        utSearchModule.renderArr.sort(function(a, b) {
                            return parseInt(a[oKey]) - parseInt(b[oKey]);
                        });
                        $('.ut-sortAlpha').removeClass('sortAsce sortDesc');
                    } else {
                        return false;
                    }

                    $(this).addClass('sortAsce');
                } else {
                    if (oAlpha) {
                        utSearchModule.renderArr.sort(function(a, b) {
                            if (a[oKey] < b[oKey]) return 1;
                            if (a[oKey] > b[oKey]) return -1;

                            return 0;
                        });
                    } else if (oNum || oPercent) {
                        utSearchModule.renderArr.sort(function(a, b) {
                            return parseInt(b[oKey]) - parseInt(a[oKey]);
                        });
                    } else {
                        return false;
                    }

                    $(this).removeClass('sortAsce').addClass('sortDesc');
                }
                
                if (utSearchModule.$filterFocusFunds.is(':checked')) {
                    var _data = utSearchModule.sortFocusFunds(utSearchModule.renderArr);
                        utSearchModule.showSearchResult(_data, isTableSort);
                } else {
                    utSearchModule.showSearchResult(utSearchModule.renderArr, isTableSort);
                }
            });

            this.$selectBox.find('select').change(function() {
                var selectedOpt = $(this).val();
                $(this).next().text(selectedOpt);
                
                if (!utSearchModule.isMobile()) {
                    utSearchModule.fiterResults(this.id, $(this).val(), $(this).prop('selectedIndex'));
                }
            });

            this.$mToggleFilter.on('click', function(e) {
                if (utSearchModule.isMobile()) {
                    e.preventDefault();

                    if ($('.filter-ctrls').is(':hidden')) {
                        $(this).addClass('on');
                        $('.filter-ctrls').slideDown();
                    } else {
                        $(this).removeClass('on');
                        $('.filter-ctrls').slideUp();
                    }
                } else {
                    return false;
                }
            });

            if (this.isMobile()) {
                $('.m-filter-btn').on('click', 'button', function() {
                    if (this.className == 'apply-btn') {
                        $('.filter-ctrls option:selected').each(function(i, el) {
                            if ($(this).index() > 0) {
                                utSearchModule.filterObj[$(this).parent().attr('id')] = $(this).val();
                            } else {
                                delete utSearchModule.filterObj[$(this).parent().attr('id')];
                            }
                            
                            var arr = utSearchModule.dataArr;

                            function filter(arr, criteria) {
                                return arr.filter(function(obj) {
                                    return Object.keys(criteria).every(function(c) {
                                        return obj[c] == criteria[c];
                                    });
                                });
                            }
                            
                            if (Object.keys(utSearchModule.filterObj).length === 0) {
                                utSearchModule.renderArr = utSearchModule.dataArr
                            } else {
                                utSearchModule.renderArr = filter(arr, utSearchModule.filterObj);
                            }
                            
                            if(utSearchModule.renderArr.length === 0) {
                                $('#utInfo').show().html('No Results. Try with different option!');
                                $('.filter-ctrls').slideUp();
                            } else {
                                $('#utInfo').hide()
                            }
                            
                            if (utSearchModule.$filterFocusFunds.is(':checked')) {
                                var _data = utSearchModule.sortFocusFunds(utSearchModule.renderArr);
                                    utSearchModule.showSearchResult(_data);
                            } else {
                                utSearchModule.showSearchResult(utSearchModule.renderArr);
                            }
                            
                            utSearchModule.printListCount(utSearchModule.renderArr);

                            $(this).removeClass('on');
                            $('.filter-ctrls').slideUp();
                        });

                    } else {
                        utSearchModule.$selectBox.find('select').not(this).prop('selectedIndex', 0);
                        utSearchModule.renderArr = utSearchModule.dataArr;
                        
                    
                        if (utSearchModule.$filterFocusFunds.is(':checked')) {
                            var _data = utSearchModule.sortFocusFunds(utSearchModule.renderArr);
                                utSearchModule.showSearchResult(_data);
                        } else {
                            utSearchModule.showSearchResult(utSearchModule.renderArr);
                        }

                        $(this).removeClass('on');
                        $('.filter-ctrls').slideUp();
                    }
                });
            }
            
            this.$filterFocusFunds.on('click', function() {
                if (utSearchModule.$filterFocusFunds.is(':checked')) {
                    var _data = utSearchModule.sortFocusFunds(utSearchModule.renderArr);
                        utSearchModule.showSearchResult(_data);
                } else {
                    utSearchModule.showSearchResult(utSearchModule.renderArr);
                }
            });
            
            $(this.$searchSection).on('click', '#utListBody li, #utTableBody tr', function(e) {             
                var pid = $(this).attr('data-pid'),
                    dataObj = {}, 
                    pieChartSeries = {}, 
                    areaChartSeries = {}, 
                    pieSize = '79%', 
                    pieInnerSize = '49%', 
                    template = $('#ut-modalPopupTemplate').html(),
                    lightboxHtml = Handlebars.compile(template),
                    frag = document.createDocumentFragment(),
                    div = document.createElement('div');
                
                e.preventDefault();
                setTimeout($('.ut-loader').show(), 5000);
                                       
                $('body').addClass('no-scroll');
                $(utSearchModule.$lightboxOverlay).fadeIn(200);
                
                var detailJsonUrl = $(this).attr('data-url').toLowerCase();
                
                $.getJSON(detailJsonUrl, function(json) {
                    dataObj = json;
                    
                    if(dataObj) $('.ut-loader').hide();
                    
                    div.innerHTML = lightboxHtml(dataObj);
                    frag.appendChild(div);

                    document.getElementById('lightboxContent').appendChild(frag);

                    $.each(dataObj.tabs, function(key, val) {
                        if (val.isChart) {
                            pieChartSeries = val.tabContent;
                        }
                    });
                    
                    areaChartSeries = dataObj.accordion.button1.section2.areaChartData;
                
                    if (utSearchModule.isMobile() && $(window).width() < '400') {
                        pieSize = '49%';
                        pieInnerSize = '29%';
                    }

                    utSearchModule.drawPieChart(pieChartSeries, pieSize, pieInnerSize);
                    utSearchModule.drawTimelineChart(areaChartSeries);

                }).fail(function(xhr, status, err) {
                    var msg = status + ', ' + err;
                    console.log('JSON failed to load: ' + msg);
                });
            });
                
            Handlebars.registerHelper("checkNull", function(val) {
                if(val === undefined) {
                    return "null";
                }
                return val;
            });
            
            this.$lightBoxCloseBtn.on('click', function() {
                if (utSearchModule.$lightboxOverlay + ':visible') {
                    $(utSearchModule.$lightboxOverlay).fadeOut(200);
                    $('body').removeClass('no-scroll');
                    $('#lightboxContent').empty();
                } else {
                    $('body').addClass('no-scroll');
                    $(utSearchModule.$lightboxOverlay).fadeIn(200);
                }
            });
            
            $('body').delegate('.ut-tabs li', 'click', function(e) {
                var _targetId = $(this).attr('data-target'),
                    isActive = $(_targetId).is(':visible');
                
                if(!isActive) {
                    $('.ut-tabs li.active').removeClass('active');
                    $(this).toggleClass('active');
                    $('.tab-content').slideUp(400);
                    $(_targetId).slideDown(400);
                }
                
            });
        },
        drawPieChart: function(pieChartSeries, pieSize, pieInnerSize) {
            new Highcharts.Chart({
                chart: {
                    renderTo: 'pieChart',
                    type: 'pie',
                    spacingBottom:30,
                    spacingTop:0,
                    spacingLeft:0,
                    spacingRight:0
                },
                title: {
                    text: '',
                    style: {
                        display: 'none'
                    } 
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            formatter: function() {
                                return '<span style="font-family:\'Frutiger\',Arial,sans-serif;font-size:14px;color:#000;">' + this.point.name + '<br/>' + Highcharts.numberFormat(this.percentage, 2) + '% </span>';
                            }
                        },
                        showInLegend: false
                    }
                },
                series: [{
                    size: pieSize,
                    innerSize: pieInnerSize,
                    shadow: false,
                    name: 'Count',
                    data: pieChartSeries
                }]
            });
        },
        drawTimelineChart: function(areaChartSeries) {
            new Highcharts.Chart({
                chart: {
                    renderTo: 'timelineChart',
                    zoomType: 'x'
                },
                title: {
                    text: 'USD to EUR exchange rate over time'
                },
                title: {
                    text: '',
                    style: {
                        display: 'none'
                    } 
                },
                credits: {
                    enabled: false
                },
                subtitle: {
                    text: document.ontouchstart === undefined ?
                            'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
                },
                xAxis: {
                    type: 'datetime',
                    gridLineWidth: 1,
                    gridLineDashStyle: 'dot'
                },
                yAxis: {
                    gridLineWidth: 1,
                    gridLineDashStyle: 'dot',
                    title: {
                        text: ''
                    }
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    area: {
                        fillColor: 'rgba(255,221,187,0.3)',
                        marker: {
                            enabled:false
                        },
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },

                series: [{
                    type: 'area',
                    name: 'USD to EUR',
                    color: 'rgb(255,170,68)',
                    shadow: false,
                    data: areaChartSeries
                }]
            });
        },
        fiterResults: function(id, value, optionIndex) {
            utSearchModule.filterObj[id] = value;

            var arr = this.dataArr;

            if (optionIndex === 0) {
                delete this.filterObj[id];
            }

            function filter(arr, criteria) {
                return arr.filter(function(obj) {
                    return Object.keys(criteria).every(function(c) {
                        return obj[c] == criteria[c];
                    });
                });
            }

            this.renderArr = filter(arr, utSearchModule.filterObj);
            
            if (this.$filterFocusFunds.is(':checked')) {
                var _data = this.sortFocusFunds(this.renderArr);
                    this.showSearchResult(_data);
            } else {
                this.showSearchResult(this.renderArr);
            }

            this.printListCount(this.renderArr);

            return;
        },
        sortFocusFunds: function(data) {
            var _focusFunds = $.grep(data, function(val, el) {
                return val['isFocusFund'] == true;
            }, false);

            var _nonFocusFunds = $.grep(data, function(val, el) {
                return val['isFocusFund'] == true;
            }, true);

            return $.merge($.merge( [], _focusFunds ), _nonFocusFunds);
        },
        showSearchResult: function(data, isTableSort) {
            this.sortFocusFunds(data);
            var bindHTMLFragment = '',
                htmlFragments = [],
                dataLen = data.length;
            
            if (dataLen === 0) {
                this.$table.hide();
                this.$list.hide();
                this.$pager.hide();
                $('#toggleView').hide();

                return;
            } else {
                this.$pager.show();
                $('#toggleView').show();
            }

            this.toggleViewId = $('#toggleView a.on').attr('data-target');

            if (this.isMobile() && $(window).width() < '768') {
                this.isList = true;
                this.toggleViewId = 'utListBody';
            }

            if (this.isList) {
                this.$table.hide();
                this.$list.show();

                $('#' + this.toggleViewId).html('');
                
                if (this.$filterFocusFunds.is(':checked')) {
                    data = this.sortFocusFunds(data);
                }
                
                $.each(data, function(key, val) {
                    
                    var _utFocusFundClass;
                    
                    if(val['isFocusFund'] == true) {
                        _utFocusFundClass = 'ut-focusfund';
                    } else {
                        _utFocusFundClass = '';
                    };
                    
                    var bindHTMLFragment = '<li class="' + _utFocusFundClass + '" data-pid="' + val.pid  + '" data-url="' + val.fundDetailUrl + '?pid=' + val.pid  + '&region=' + val.region +  '&currency=' + val.currency + '"><a href="#">' +
                        '<label>' + val.fundName +
                        '</label>' +
                        '<p>' + val.percentage +
                        '<span>' + val.investMedium + '</span>' +
                        '<p>';
                    '</a></li>';

                    htmlFragments.push(bindHTMLFragment);

                    utSearchModule.$pager.addClass('ut-list');
                });
            } else {
                
                this.$table.show();
                this.$list.hide();

                $('#' + this.toggleViewId).html('');
                $.each(data, function(key, val) {
                    var _utBadgeElm;

                    if(val['isFocusFund'] == true) {
                        _utBadgeElm = '<span class="ut-badge">FOCUS FUND</span>';
                    } else {
                        _utBadgeElm = '';
                    };

                    var bindHTMLFragment = '<tr data-pid="' + val.pid  + '"data-url="' + val.fundDetailUrl + '&pid=' + val.pid  + '&region=' + val.region +  '&currency=' + val.currency +  '">' +
                        '<td class="cellLeft">' + val.fundName + _utBadgeElm +'</td>' +
                        '<td class="cellLeft">' + val.currency + '</td>' +
                        '<td class="cellRight ' + utSearchModule.numCheck(val.threeMth) + '">' + val.threeMth + '</td>' +
                        '<td class="cellRight ' + utSearchModule.numCheck(val.sixMth) + '">' + val.sixMth + '</td>' +
                        '<td class="cellRight ' + utSearchModule.numCheck(val.oneYr) + '">' + val.oneYr + '</td>' +
                        '<td class="cellRight ' + utSearchModule.numCheck(val.threeYr) + '">' + val.threeYr + '</td>' +
                        '<td class="cellRight ' + utSearchModule.numCheck(val.threeYrsd) + '">' + val.threeYrsd + '</td>' +
                        '</tr>';

                    htmlFragments.push(bindHTMLFragment);

                    utSearchModule.$pager.addClass('ut-table');
                });
            }

            $('#' + this.toggleViewId).append(htmlFragments);
            
            this.pagination(this.toggleViewId, isTableSort);
        },
        numCheck: function(x) {
            if (x == null) return false;

            var numCheck = (x > 0) ? 'cellGreen' : 'cellRed';

            if (x == '&mdash;') numCheck = 'mDash';

            return numCheck;
        },
        pagination: function(elm, isTableSort) {
            var midVal = 10;

            if (this.isMobile()) {
                midVal = 7;
            }
            var options = {
                containerID: elm,
                perPage: (elm === 'utTableBody') ? 15 : 24,
                midRange: midVal,
                startRange: 0,
                endRange: 0,
                first: false,
                previous: 'Prev',
                next: 'Next',
                callback: function(pages, items) {
                    utSearchModule.printListCount(utSearchModule.renderArr);
                    if (!isTableSort) {
                        utSearchModule.scrollToTop();
                    }
                    return false;
                }
            };

            this.$pager.jPages(options);
        },
        printListCount: function(data) {
            this.$countLegend.html(data.length + ' Items');
        },
        scrollToTop: function() {
            $('html, body').animate({
                scrollTop: this.$searchSection.offset().top
            }, 500);
        }
    };

    utSearchModule.init();
});