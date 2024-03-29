
        //READ CREATE UPDATE DELETE

        function getListItem(listName) {

            let list = listName;

            let init = {
                method: 'GET',
                headers: {
                    'X-RequestDigest': document.getElementById('__REQUESTDIGEST').value,
                    'Accept': 'application/json; odata=verbose'
                },
                credentials: 'include'
            }

            fetch(_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('" + list + "')/items", init).then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                else {
                    throw new Error('Network response was not ok.');
                }
            }).then(function (data) {

                console.log(list, data);

            }).catch(function (error) {

            })

        }

        function createListItem(listName) {

            let list = listName;

            let init = {
                method: 'GET',
                headers: {
                    'X-RequestDigest': document.getElementById('__REQUESTDIGEST').value,
                    'Accept': 'application/json; odata=verbose'
                },
                credentials: 'include'
            }

            fetch(_spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('" + list + "')?$select=ListItemEntityTypeFullName", init).then(function (response) {

                if (response.ok) {
                    return response.json();
                }
                else {
                    throw new Error('Network response was not ok.');
                }
            }).then(function (data) {

                let metadata = {
                    Title: 'New List Item',
                    __metadata: {
                        type: data.d.ListItemEntityTypeFullName
                    }
                }

                let init = {
                    method: 'POST',
                    headers: {
                        'X-RequestDigest': document.getElementById('__REQUESTDIGEST').value,
                        'Accept': 'application/json; odata=verbose',
                        'Content-Type': 'application/json; odata=verbose'
                    },
                    credentials: 'include',
                    body: JSON.stringify(metadata)
                }

                return fetch(_spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('" + list + "')/items", init);

            }).then(function (response) {

                if (response.ok) {

                    console.log('Item created!')
                }
                else {
                    throw new Error('Network response was not ok.');
                }
            }).catch(function (error) {

                console.error(error);

            })
        };


        function updateListItem(listName, itemId) {

            let list = listName;
            let id = itemId;

            let init = {
                method: 'GET',
                headers: {
                    'X-RequestDigest': document.getElementById('__REQUESTDIGEST').value,
                    'Accept': 'application/json; odata=verbose'
                },
                credentials: 'include'
            }

            fetch(_spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('" + list + "')/Items(" + id + ")", init).then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                else {
                    throw new Error('Network response was not ok.');
                }
            }).then(function (data) {

                let metadata = {
                    Title: 'Updated List Item',
                    __metadata: {
                        type: data.d.__metadata.type
                    }
                }

                let init = {
                    method: 'POST',
                    headers: {
                        'X-RequestDigest': document.getElementById('__REQUESTDIGEST').value,
                        'Accept': 'application/json; odata=verbose',
                        'Content-Type': 'application/json; odata=verbose',
                        'X-HTTP-Method': 'MERGE',
                        'If-Match': data.d.__metadata.etag
                    },
                    credentials: 'include',
                    body: JSON.stringify(metadata)
                }


                return fetch(_spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('" + list + "')/Items(" + id + ")", init);

            }).then(function (response) {

                if (response.ok) {

                    console.log('Item updated.')
                }
                else {
                    throw new Error('Network response was not ok.');
                }
            }).catch(function (error) {

                console.error(error);

            })
        }

        function deleteListItem(listName, itemId) {

            let list = listName;
            let id = itemId;

            let init = {
                method: 'POST',
                headers: {
                    'X-RequestDigest': document.getElementById('__REQUESTDIGEST').value,
                    'Accept': 'application/json; odata=verbose',
                    'X-HTTP-Method': 'DELETE',
                    'If-Match': '*'
                },
                credentials: 'include'
            }

            fetch(_spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('" + list + "')/Items(" + id + ")", init).then(function (response) {

                if (response.ok) {

                    console.log('Item deleted.')
                }
                else {
                    throw new Error('Network response was not ok.');
                }
            }).catch(function (error) {

                console.error(error);

            })
        }



        // PEOPLE PICKER

        // Register people picker
        // $("#iaProjektleitung").spPeoplePicker();
        // <label for="peoplePicker">PeoplePicker</label>
        // <div id="peoplePicker"></div>


        (function ($) {
            RegisterScriptFiles('clienttemplates.js');
            RegisterScriptFiles('clientforms.js');
            RegisterScriptFiles('clientpeoplepicker.js');
            RegisterScriptFiles('autofill.js');

            function RegisterScriptFiles(filename) {
                var scriptEle = document.createElement('script');
                scriptEle.setAttribute("type", "text/javascript")
                scriptEle.setAttribute("src", "/_layouts/15/" + filename);
                document.getElementsByTagName("head")[0].appendChild(scriptEle)

            }

            function initializePeoplePicker(eleId) {
                var schema = {};
                schema['PrincipalAccountType'] = 'User,DL,SecGroup,SPGroup';
                schema['SearchPrincipalSource'] = 15;
                schema['ResolvePrincipalSource'] = 15;
                schema['AllowMultipleValues'] = true;
                schema['MaximumEntitySuggestions'] = 50;
                schema['Width'] = '280px';
                this.SPClientPeoplePicker_InitStandaloneControlWrapper(eleId, null, schema);
            }

            function GetPeoplePicker(eleId) {
                if (eleId != undefined) {
                    var toSpanKey = eleId + "_TopSpan";
                    var peoplePicker = null;
                    var ClientPickerDict = this.SPClientPeoplePicker.SPClientPeoplePickerDict;
                    for (var propertyName in ClientPickerDict) {
                        if (propertyName == toSpanKey) {
                            peoplePicker = ClientPickerDict[propertyName];
                            break;
                        }
                    }
                    return peoplePicker;
                }
            }

            function GetPeoplePickerIds(eleId) {
                var peoplePicker = GetPeoplePicker(eleId);
                if (peoplePicker != null) {
                    // Get information about all users.
                    var users = peoplePicker.GetAllUserInfo();
                    var userInfo = [];
                    for (var i = 0; i < users.length; i++) {
                        var user = users[i];
                        //userInfo += user['DisplayText'] + ";#";
                        var userID = GetPeoplePickerUserID(user.Key);
                        userInfo.push(userID);

                    }
                    return userInfo;
                } else
                    return '';
            }

            function GetPeoplePickerNames(eleId) {
                var peoplePicker = GetPeoplePicker(eleId);
                if (peoplePicker != null) {
                    // Get information about all users.
                    var users = peoplePicker.GetAllUserInfo();
                    var userInfo = '';
                    for (var i = 0; i < users.length; i++) {
                        var user = users[i];
                        userInfo += user['DisplayText'] + ";#";
                    }
                    return userInfo;
                } else
                    return '';
            }

            function SetUserInPeoplePicker(eleId, userIDArray) {
                var peoplePicker = GetPeoplePicker(eleId);
                if (peoplePicker != null) {
                    userIDArray.forEach(function (item) {
                        var userInfo = GetUserInfoByID(item);
                        if (userInfo != null) {
                            peoplePicker.AddUserKeys(userInfo.LoginName, false);
                        }
                    })
                }
            }

            function GetPeoplePickerUserID(userNameString) {
                var itemID = "";
                $.ajax({
                    url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/ensureuser",
                    method: "POST",
                    async: false,
                    contentType: "application/json;odata=verbose",
                    data: JSON.stringify({
                        logonName: userNameString
                    }),
                    headers: {
                        "Accept": "application/json; odata=verbose",
                        "X-RequestDigest": $("#__REQUESTDIGEST").val()
                    },
                    success: function (data) {
                        itemID = data.d.Id;
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });

                return itemID;
            }

            function GetUserInfoByID(ID) {
                var userInfo = "";
                $.ajax({
                    url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/getuserbyid(" + ID + ")",
                    method: "GET",
                    async: false,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (data) {
                        userInfo = data.d;
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
                return userInfo;
            }

            $.fn.spPeoplePicker = function () {
                var eleId = $(this).attr('id');
                ExecuteOrDelayUntilScriptLoaded(function () {
                    initializePeoplePicker(eleId);
                }, 'sp.core.js');
            };
            $.fn.GetUserNames = function () {
                var eleId = $(this).attr('id');
                var spUsersInfo = GetPeoplePickerNames(eleId);
                return spUsersInfo.slice(0, -2);
            }
            $.fn.GetUserIDs = function () {
                var eleId = $(this).attr('id');
                var spUsersInfo = GetPeoplePickerIds(eleId);
                return spUsersInfo;
            }
            $.fn.SetUserIDs = function (items) {
                if (items.length > 0) {
                    var eleId = $(this).attr('id');
                    var spUsersInfo = SetUserInPeoplePicker(eleId, items);
                    return spUsersInfo;
                }
            }
        })(jQuery);


        // TAXONOMY

        // Register Taxonomy
        // addTaxonomyPicker("taxonomy", "3c5d0fdf-a6a0-499b-bd2b-7aab4b03d0cd")
        // <label for="taxonomy">Abteilung</label>
        // <div id="taxonomy" style="margin-top: 7px;">

        function addTaxonomyPicker(targetDivId, termSetID) {
            SP.SOD.loadMultiple(['sp.js'], function () {
                SP.SOD.registerSod('sp.taxonomy.js',
                    SP.Utilities.Utility.getLayoutsPageUrl('sp.taxonomy.js'));
                SP.SOD.registerSod('scriptforwebtaggingui.js',
                    SP.Utilities.Utility.getLayoutsPageUrl('scriptforwebtaggingui.js'));
                SP.SOD.registerSod('sp.ui.rte.js',
                    SP.Utilities.Utility.getLayoutsPageUrl('sp.ui.rte.js'));
                SP.SOD.registerSod('scriptresources.resx',
                    SP.Utilities.Utility.getLayoutsPageUrl('ScriptResx.ashx?culture=en-us&name=ScriptResources'));

                // UNCOMMENT THIS FOR O365
                SP.SOD.registerSod('ms.rte.js',
                    SP.Utilities.Utility.getLayoutsPageUrl('ms.rte.js'));

                // UNCOMMENT THIS FOR O365
                SP.SOD.loadMultiple(['ms.rte.js'], function () {
                    SP.SOD.loadMultiple(['sp.taxonomy.js', 'sp.ui.rte.js',
                        'scriptresources.resx'
                    ], function () {

                        taxonomyPickerHelper.initPicker(targetDivId, termSetID);

                    });
                });
            });
        }

        var taxonomyPickerHelper = taxonomyPickerHelper || {
            initPicker: function (containerId, termSetId) {
                // Create empty picker template and hidden input field
                var pickerContainerId = containerId + '_picker';
                var pickerInputId = containerId + '_input';

                var html = '<input name="' + pickerInputId + '" type="hidden" id="';
                html += pickerInputId + '" />';
                html += '<div id="' + pickerContainerId;
                html += '" class="ms-taxonomy ms-taxonomy-height ms-taxonomy-width"></div>';

                jQuery('#' + containerId).html(html);

                // Get Termstore ID and init control
                taxonomyPickerHelper.getTermStoreId().then(function (sspId) {
                    taxonomyPickerHelper.initPickerControl(sspId, termSetId,
                        pickerContainerId, pickerInputId);
                });
            },

            getSelectedValue: function (containerId) {
                return jQuery('#' + containerId + '_input input').val();
            },

            getTermStoreId: function () {
                var deferred = jQuery.Deferred();

                var context = new SP.ClientContext.get_current();
                var session = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);
                var termStore = session.getDefaultSiteCollectionTermStore();

                context.load(session);
                context.load(termStore);

                context.executeQueryAsync(
                    function () {
                        var sspId = termStore.get_id().toString();
                        deferred.resolve(sspId);
                    },
                    function () {
                        deferred.reject("Unable to access Managed Metadata Service");
                    }
                );

                return deferred.promise();
            },

            initPickerControl: function (sspId, termSetId,
                pickerContainerId, pickerInputId) {
                var tagUI = document.getElementById(pickerContainerId);
                if (tagUI) {
                    tagUI['InputFieldId'] = pickerInputId;
                    tagUI['SspId'] = sspId;
                    tagUI['TermSetId'] = termSetId;
                    tagUI['AnchorId'] = '00000000-0000-0000-0000-000000000000';
                    tagUI['IsMulti'] = false;
                    tagUI['AllowFillIn'] = false;
                    tagUI['IsSpanTermSets'] = false;
                    tagUI['IsSpanTermStores'] = false;
                    tagUI['IsIgnoreFormatting'] = false;
                    tagUI['IsIncludeDeprecated'] = false;
                    tagUI['IsIncludeUnavailable'] = false;
                    tagUI['IsIncludeTermSetName'] = false;
                    tagUI['IsAddTerms'] = false;
                    tagUI['IsIncludePathData'] = false;
                    tagUI['IsUseCommaAsDelimiter'] = false;
                    tagUI['Disable'] = false;
                    tagUI['ExcludeKeyword'] = false;
                    tagUI['JavascriptOnValidation'] = "";
                    tagUI['DisplayPickerButton'] = true;
                    tagUI['Lcid'] = 1033;
                    tagUI['FieldName'] = '';
                    tagUI['FieldId'] = '00000000-0000-0000-0000-000000000000';
                    tagUI['WebServiceUrl'] = _spPageContextInfo.webServerRelativeUrl + '\u002f_vti_bin\u002fTaxonomyInternalService.json';

                    SP.SOD.executeFunc('ScriptForWebTaggingUI.js',
                        'Microsoft.SharePoint.Taxonomy.ScriptForWebTaggingUI.taggingLoad',
                        function () {
                            Microsoft.SharePoint.Taxonomy.ScriptForWebTaggingUI.resetEventsRegistered();
                        }
                    );

                    SP.SOD.executeFunc('ScriptForWebTaggingUI.js',
                        'Microsoft.SharePoint.Taxonomy.ScriptForWebTaggingUI.onLoad',
                        function () {
                            Microsoft.SharePoint.Taxonomy.ScriptForWebTaggingUI.onLoad(pickerContainerId);
                        });
                }
            }
        };



        // PERMISSIONS
        var ITSP = ITSP || {};
        ITSP.SharePoint = ITSP.SharePoint || {};

        ITSP.SharePoint.Init = function () {

            var deferred = $.Deferred();
            ITSP.SharePoint.Context = SP.ClientContext.get_current();

            var context = ITSP.SharePoint.Context;

            ITSP.SharePoint.Web = context.get_web();
            context.load(ITSP.SharePoint.Web, 'AssociatedOwnerGroup');

            ITSP.SharePoint.CurrentUser = ITSP.SharePoint.Web.get_currentUser();
            context.load(ITSP.SharePoint.CurrentUser);

            ITSP.SharePoint.SiteGroups = ITSP.SharePoint.Web.get_siteGroups();
            context.load(ITSP.SharePoint.SiteGroups);

            ITSP.SharePoint.CurrentUser.GroupMembership = ITSP.SharePoint.CurrentUser.get_groups();
            context.load(ITSP.SharePoint.CurrentUser.GroupMembership);

            context.executeQueryAsync(
                function (sender, args) {
                    deferred.resolve();
                },
                function OnFailure(sender, args) {
                    deferred.resolve();
                }
            );

            return deferred.promise();
        }

        function IsUserInGroup(user, groupName) {
            var deferred = $.Deferred();
            var checkGroup = user.get_groups().getByName(groupName);

            var context = ITSP.SharePoint.Context;
            context.load(checkGroup);
            context.executeQueryAsync(
                function (sender, args) {
                    var userInGroup = false;
                    if (checkGroup) {
                        userInGroup = true;
                    }
                    deferred.resolve(userInGroup);
                },
                function (sender, args) {
                    var userInGroup = false;
                    deferred.resolve(userInGroup);
                }
            );



            return deferred.promise();
        }

        function GetOwnerWebGroup() {
            var deferred = $.Deferred();

            var ownerGroup = null;
            ownerGroup = ITSP.SharePoint.Web.get_associatedOwnerGroup();

            var context = ITSP.SharePoint.Context;
            context.load(ownerGroup);
            context.executeQueryAsync(
                function (sender, args) {
                    var ownerGroupName = ownerGroup.get_title();
                    deferred.resolve(ownerGroupName);
                },
                function (sender, args) {
                    var ownerGroupName = "";
                    deferred.resolve(ownerGroupName);
                });



            return deferred.promise();
        }

        function ShowElementIfMemberOrAdmin() {


            var elementName = '#newEmpfehlung';
            var memberGroupName = "Berater Finanz- und Investitionsausschuss";

            //hide the element
            $(elementName).hide();

            //Initialise everything first
            ITSP.SharePoint.Init().done(function () {

                //check is the user site admin or in owners group
                var userIsAdmin = ITSP.SharePoint.CurrentUser.get_isSiteAdmin();
                var userIsMemberOfSiteOwnerGroup = false;
                var userIsMemberOfGroup = false;

                var ownerGroupName = "";

                //use promises to cascade and get all the returns from the checks.
                GetOwnerWebGroup().then(function (groupName) {
                    ownerGroupName = groupName;

                    return IsUserInGroup(ITSP.SharePoint.CurrentUser, ownerGroupName);
                }).then(function (argument) {
                    userIsMemberOfSiteOwnerGroup = argument;
                    return IsUserInGroup(ITSP.SharePoint.CurrentUser, memberGroupName);
                }).then(function (argument) {
                    userIsMemberOfGroup = argument;

                    if (userIsMemberOfGroup) { //userIsAdmin || userIsMemberOfSiteOwnerGroup ||
                        // alert("User is either admin or in group");
                        $(elementName).show();
                    }
                    else {

                        // alert("User is not in group or admin");
                        $(elementName).hide();
                    }
                });


            });

        };



        // SUPPORT FUNCIONS

        // Get href Id

        GetUrlKeyValue("ID", false, location.href);


        // Filter

        // Register filter
        // setInputFilter(target, function (value) {
        //                 return /^-?\d*[.,]?\d{0,2}$/.test(value);
        //             });

        function setInputFilter(target, inputFilter) {
            ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
                target.addEventListener(event, function () {
                    if (inputFilter(this.value)) {
                        this.oldValue = this.value;
                        this.oldSelectionStart = this.selectionStart;
                        this.oldSelectionEnd = this.selectionEnd;
                    } else if (this.hasOwnProperty("oldValue")) {
                        this.value = this.oldValue;
                        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                    } else {
                        this.value = "";
                    }
                });
            });
        };


    

        //Register validate
        
         document.querySelector("#iaKalkulationszins").addEventListener("keypress", function (e) {
             validate(event, this);
         })

        function validate(evt, ele) {
            var theEvent = evt || window.event;
            var key = theEvent.keyCode || theEvent.which;
            key = String.fromCharCode(key);
            var value = ele.value + key;
            var regex = /^\d+(,\d{0,2})?$/;
            if (!regex.test(value)) {
                theEvent.returnValue = false;
                if (theEvent.preventDefault) theEvent.preventDefault();
            }
        }


Footer
© 2023 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Docs
Contact GitHub
Pricing
API
Training
Blog
About
code/rest api at main · EYKonnikov/code
