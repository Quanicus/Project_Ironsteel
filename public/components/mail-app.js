class MailApp extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
                :host {
                    position: relative;
                    display: flex;
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    font-size: 14px;
                    border: 1px solid #303030;
                }
                * {
                    box-sizing: border-box;
                    order: 2px dotted green;
                }
                .resize_container {
                    position: relative;
                    display: inline-flex;
                    height: 100%;

                    width: 60%;
                    min-width: min-content;
                    
                    & .nav_container {  
                        display: flex;
                        flex-direction: column;          
                        height: 100%;
                        
                        max-width: 250px;
                        max-height: 100%;

                        & icon-nav {
                            width: 250px;
                            border: none;
                            flex-grow: 1;
                        }
                    }

                    .preview_window {
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        border: 1px solid #303030;
                        border-top: none;
                        border-bottom: none;
                        flex-grow: 1;
                        flex-shrink: 0;
                        width: 300px;

                        & .header .title {
                            font-size: 1.25em;
                            line-height: 1.75em;
                        }
                        & .content {
                            overflow: scroll;
                        }
                        & .resize_handle {
                            display: grid;
                            place-content: center;
                            border-radius: 4px;
                            position: absolute;
                            right: -.35rem;
                            top: 50%;
                            width: .7rem;
                            height: 1rem;
                            background-color: #303030;
                            z-index: 10;

                            &:hover {
                                cursor: grab;
                            }
                        }

                        & .content {
                            display: flex;
                            flex-direction: column;
                            gap: 0.5rem;
                            padding: 1rem;
                            padding-bottom: none;
                            width: 100%;
                        }
                    }  
                }  

                .mail_display {
                    position: relative;
                    display: inline-flex;
                    flex-direction: column;
                    height: 100%;
                    flex-grow: 1;
                    min-width: 300px;
                    max-height: 100%;
                    
                    & .header {
                        padding-inline: .5rem;

                        & .toolbar {
                            display: flex;

                            & .icon {
                                padding: .5rem;
                                border-radius: 8px;
                                cursor: pointer;

                                &:hover {
                                    background-color: #303030;
                                }
                            }
                        }
                    }

                    & .head {
                        display: flex;
                        border-bottom: 1px solid #303030;
                        
                        & profile-icon {
                            padding: 1rem;
                            
                        }
                        & .info_container {
                            display: flex;
                            flex-direction: column;
                            flex-grow: 1;
                            padding: 1rem;
                            padding-left: 0;
                            gap: 0.5rem;
                            
                            & .heading {
                                display: flex;
                                justify-content: space-between;
                            }
                        }
                    }
                    & .body {
                        padding: 1rem;
                        flex-grow: 1;

                        overflow: scroll;
                    }
                    .reply_container {
                        padding: 1rem;
                        border-top: 1px solid #303030;

                        & textarea {
                            width: 100%;
                            border-radius: 8px;
                            border: 1px solid #303030;
                            background-color: black;
                            color: white;
                            outline: none;
                            resize: none;
                            padding: .5rem;
                            overflow: auto;
                            min-height: 4rem;
                            max-height: 300px;

                            &:focus {
                                border-color: white;
                            }
                        }
                        & .submit_container {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding-top: 1rem;
                            
                            & shad-toggle {
                                
                            }
                            & #send_message {
                            
                            }
                        } 
                    }
                    
                }
                .header {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid #303030;
                    max-width: 100%;
                    padding-inline: 1rem;
                    min-height: 3rem;
                }
                
            </style>
           
            <div class="resize_container">
                <div class="nav_container">
                    <div class="header">
                        <div class="drop-down">c:</div>
                    </div>
                    <icon-nav>
                        <div data-name="Inbox">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-inbox mr-2 h-4 w-4">
                                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                                <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                            </svg>
                        </div>
                        <div data-name="Drafts">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file mr-2 h-4 w-4"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path></svg>
                        </div>
                        <div data-name="Sent">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send mr-2 h-4 w-4"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
                        </div>
                        <div data-name="Junk">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-archive-x mr-2 h-4 w-4"><rect width="20" height="5" x="2" y="3" rx="1"></rect><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path><path d="m9.5 17 5-5"></path><path d="m9.5 12 5 5"></path></svg>
                        </div>
                        <div data-name="Trash">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 h-4 w-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                        </div>
                        <div data-name="Archive">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-archive mr-2 h-4 w-4"><rect width="20" height="5" x="2" y="3" rx="1"></rect><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path><path d="M10 12h4"></path></svg>
                        </div>
                        <div data-name="Social">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-round mr-2 h-4 w-4"><path d="M18 21a8 8 0 0 0-16 0"></path><circle cx="10" cy="8" r="5"></circle><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"></path></svg>
                        </div>
                        <div data-name="Updates">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-alert mr-2 h-4 w-4"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>
                        </div>
                        <div data-name="Forums">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-messages-square mr-2 h-4 w-4"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2z"></path><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path></svg>
                        </div>
                        <div data-name="Shopping">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart mr-2 h-4 w-4"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
                        </div>
                        <div data-name="Promotions">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-archive mr-2 h-4 w-4"><rect width="20" height="5" x="2" y="3" rx="1"></rect><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path><path d="M10 12h4"></path></svg>
                        </div>
                    </icon-nav>
                </div>

                <div class="preview_window">
                    <div class="header">
                        <span class="title"></span>
                        <div class="filter_options">sup</div>
                    </div>
                    <div class="content">
                        <message-preview data-timestamp="2023-01-01 14:45:30" data-subject="where's my money" data-name="Timmy">Hey you stop looking at me, consectetur adipiscing elit. Sed ullamcorper, erat eget eleifend varius, metus ex luctus quam, eu egestas arcu nisi in lacus. Quisque ultrices ante nibh, at elementum nunc imperdiet id. Nulla ornare velit sed ex laoreet pretium. Vestibulum elementum lorem dui, eu placerat metus dapibus rutrum. Nullam imperdiet semper mauris, sed tristique orci sagittis ac. Suspendisse ultrices libero non tellus venenatis, in tincidunt mauris vulputate. In aliquam, ligula tempus tempus convallis, tortor nunc faucibus enim, eget luctus mi nisi non justo. Donec auctor pulvinar pellentesque. Suspendisse dolor massa, condimentum vitae convallis a, consectetur ac tortor. Aenean eget consectetur diam. Sed vel erat at eros euismod vulputate accumsan ut nunc. Etiam purus libero, rutrum non aliquet consectetur, feugiat sed lacus. Nulla nunc dolor, tincidunt a dignissim ac, iaculis non tellus. Duis facilisis lobortis augue ut faucibus. Sed aliquam turpis ligula, varius blandit arcu ornare nec. Vestibulum semper, ipsum vel vehicula aliquam, libero augue luctus lorem, id tincidunt neque sapien nec neque.</message-preview>
                        <message-preview data-timestamp="2023-01-01 14:45:30" data-subject="i love you" data-name="Jimmy">I love your cookies, consectetur adipiscing elit. Sed ullamcorper, erat eget eleifend varius, metus ex luctus quam, eu egestas arcu nisi in lacus. Quisque ultrices ante nibh, at elementum nunc imperdiet id. Nulla ornare velit sed ex laoreet pretium. Vestibulum elementum lorem dui, eu placerat metus dapibus rutrum. Nullam imperdiet semper mauris, sed tristique orci sagittis ac. Suspendisse ultrices libero non tellus venenatis, in tincidunt mauris vulputate. In aliquam, ligula tempus tempus convallis, tortor nunc faucibus enim, eget luctus mi nisi non justo. Donec auctor pulvinar pellentesque. Suspendisse dolor massa, condimentum vitae convallis a, consectetur ac tortor. Aenean eget consectetur diam. Sed vel erat at eros euismod vulputate accumsan ut nunc. Etiam purus libero, rutrum non aliquet consectetur, feugiat sed lacus. Nulla nunc dolor, tincidunt a dignissim ac, iaculis non tellus. Duis facilisis lobortis augue ut faucibus. Sed aliquam turpis ligula, varius blandit arcu ornare nec. Vestibulum semper, ipsum vel vehicula aliquam, libero augue luctus lorem, id tincidunt neque sapien nec neque.</message-preview>
                        <message-preview data-timestamp="2023-01-01 14:45:30" data-subject="check out this hotdog" data-name="Ron">Wanna make out about it, consectetur adipiscing elit. Sed ullamcorper, erat eget eleifend varius, metus ex luctus quam, eu egestas arcu nisi in lacus. Quisque ultrices ante nibh, at elementum nunc imperdiet id. Nulla ornare velit sed ex laoreet pretium. Vestibulum elementum lorem dui, eu placerat metus dapibus rutrum. Nullam imperdiet semper mauris, sed tristique orci sagittis ac. Suspendisse ultrices libero non tellus venenatis, in tincidunt mauris vulputate. In aliquam, ligula tempus tempus convallis, tortor nunc faucibus enim, eget luctus mi nisi non justo. Donec auctor pulvinar pellentesque. Suspendisse dolor massa, condimentum vitae convallis a, consectetur ac tortor. Aenean eget consectetur diam. Sed vel erat at eros euismod vulputate accumsan ut nunc. Etiam purus libero, rutrum non aliquet consectetur, feugiat sed lacus. Nulla nunc dolor, tincidunt a dignissim ac, iaculis non tellus. Duis facilisis lobortis augue ut faucibus. Sed aliquam turpis ligula, varius blandit arcu ornare nec. Vestibulum semper, ipsum vel vehicula aliquam, libero augue luctus lorem, id tincidunt neque sapien nec neque.</message-preview>
                        <message-preview data-timestamp="2023-01-01 14:45:30" data-subject="vote for me" data-name="Gerald">sup punkboy, consectetur adipiscing elit. Sed ullamcorper, erat eget eleifend varius, metus ex luctus quam, eu egestas arcu nisi in lacus. Quisque ultrices ante nibh, at elementum nunc imperdiet id. Nulla ornare velit sed ex laoreet pretium. Vestibulum elementum lorem dui, eu placerat metus dapibus rutrum. Nullam imperdiet semper mauris, sed tristique orci sagittis ac. Suspendisse ultrices libero non tellus venenatis, in tincidunt mauris vulputate. In aliquam, ligula tempus tempus convallis, tortor nunc faucibus enim, eget luctus mi nisi non justo. Donec auctor pulvinar pellentesque. Suspendisse dolor massa, condimentum vitae convallis a, consectetur ac tortor. Aenean eget consectetur diam. Sed vel erat at eros euismod vulputate accumsan ut nunc. Etiam purus libero, rutrum non aliquet consectetur, feugiat sed lacus. Nulla nunc dolor, tincidunt a dignissim ac, iaculis non tellus. Duis facilisis lobortis augue ut faucibus. Sed aliquam turpis ligula, varius blandit arcu ornare nec. Vestibulum semper, ipsum vel vehicula aliquam, libero augue luctus lorem, id tincidunt neque sapien nec neque.</message-preview>
                        <message-preview data-timestamp="2023-01-01 14:45:30" data-subject="where's my money" data-name="Timmy">Hey you stop looking at me, consectetur adipiscing elit. Sed ullamcorper, erat eget eleifend varius, metus ex luctus quam, eu egestas arcu nisi in lacus. Quisque ultrices ante nibh, at elementum nunc imperdiet id. Nulla ornare velit sed ex laoreet pretium. Vestibulum elementum lorem dui, eu placerat metus dapibus rutrum. Nullam imperdiet semper mauris, sed tristique orci sagittis ac. Suspendisse ultrices libero non tellus venenatis, in tincidunt mauris vulputate. In aliquam, ligula tempus tempus convallis, tortor nunc faucibus enim, eget luctus mi nisi non justo. Donec auctor pulvinar pellentesque. Suspendisse dolor massa, condimentum vitae convallis a, consectetur ac tortor. Aenean eget consectetur diam. Sed vel erat at eros euismod vulputate accumsan ut nunc. Etiam purus libero, rutrum non aliquet consectetur, feugiat sed lacus. Nulla nunc dolor, tincidunt a dignissim ac, iaculis non tellus. Duis facilisis lobortis augue ut faucibus. Sed aliquam turpis ligula, varius blandit arcu ornare nec. Vestibulum semper, ipsum vel vehicula aliquam, libero augue luctus lorem, id tincidunt neque sapien nec neque.</message-preview>
                        <message-preview data-timestamp="2023-01-01 14:45:30" data-subject="i love you" data-name="Jimmy">I love your cookies, consectetur adipiscing elit. Sed ullamcorper, erat eget eleifend varius, metus ex luctus quam, eu egestas arcu nisi in lacus. Quisque ultrices ante nibh, at elementum nunc imperdiet id. Nulla ornare velit sed ex laoreet pretium. Vestibulum elementum lorem dui, eu placerat metus dapibus rutrum. Nullam imperdiet semper mauris, sed tristique orci sagittis ac. Suspendisse ultrices libero non tellus venenatis, in tincidunt mauris vulputate. In aliquam, ligula tempus tempus convallis, tortor nunc faucibus enim, eget luctus mi nisi non justo. Donec auctor pulvinar pellentesque. Suspendisse dolor massa, condimentum vitae convallis a, consectetur ac tortor. Aenean eget consectetur diam. Sed vel erat at eros euismod vulputate accumsan ut nunc. Etiam purus libero, rutrum non aliquet consectetur, feugiat sed lacus. Nulla nunc dolor, tincidunt a dignissim ac, iaculis non tellus. Duis facilisis lobortis augue ut faucibus. Sed aliquam turpis ligula, varius blandit arcu ornare nec. Vestibulum semper, ipsum vel vehicula aliquam, libero augue luctus lorem, id tincidunt neque sapien nec neque.</message-preview>
                        <message-preview data-timestamp="2023-01-01 14:45:30" data-subject="check out this hotdog" data-name="Ron">Wanna make out about it, consectetur adipiscing elit. Sed ullamcorper, erat eget eleifend varius, metus ex luctus quam, eu egestas arcu nisi in lacus. Quisque ultrices ante nibh, at elementum nunc imperdiet id. Nulla ornare velit sed ex laoreet pretium. Vestibulum elementum lorem dui, eu placerat metus dapibus rutrum. Nullam imperdiet semper mauris, sed tristique orci sagittis ac. Suspendisse ultrices libero non tellus venenatis, in tincidunt mauris vulputate. In aliquam, ligula tempus tempus convallis, tortor nunc faucibus enim, eget luctus mi nisi non justo. Donec auctor pulvinar pellentesque. Suspendisse dolor massa, condimentum vitae convallis a, consectetur ac tortor. Aenean eget consectetur diam. Sed vel erat at eros euismod vulputate accumsan ut nunc. Etiam purus libero, rutrum non aliquet consectetur, feugiat sed lacus. Nulla nunc dolor, tincidunt a dignissim ac, iaculis non tellus. Duis facilisis lobortis augue ut faucibus. Sed aliquam turpis ligula, varius blandit arcu ornare nec. Vestibulum semper, ipsum vel vehicula aliquam, libero augue luctus lorem, id tincidunt neque sapien nec neque.</message-preview>
                        
                    </div>
                    <div class="resize_handle">
                        <svg width="10" height="10" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5">
                            <path d="M5.5 4.625C6.12132 4.625 6.625 4.12132 6.625 3.5C6.625 2.87868 6.12132 2.375 5.5 2.375C4.87868 2.375 4.375 2.87868 4.375 3.5C4.375 4.12132 4.87868 4.625 5.5 4.625ZM9.5 4.625C10.1213 4.625 10.625 4.12132 10.625 3.5C10.625 2.87868 10.1213 2.375 9.5 2.375C8.87868 2.375 8.375 2.87868 8.375 3.5C8.375 4.12132 8.87868 4.625 9.5 4.625ZM10.625 7.5C10.625 8.12132 10.1213 8.625 9.5 8.625C8.87868 8.625 8.375 8.12132 8.375 7.5C8.375 6.87868 8.87868 6.375 9.5 6.375C10.1213 6.375 10.625 6.87868 10.625 7.5ZM5.5 8.625C6.12132 8.625 6.625 8.12132 6.625 7.5C6.625 6.87868 6.12132 6.375 5.5 6.375C4.87868 6.375 4.375 6.87868 4.375 7.5C4.375 8.12132 4.87868 8.625 5.5 8.625ZM10.625 11.5C10.625 12.1213 10.1213 12.625 9.5 12.625C8.87868 12.625 8.375 12.1213 8.375 11.5C8.375 10.8787 8.87868 10.375 9.5 10.375C10.1213 10.375 10.625 10.8787 10.625 11.5ZM5.5 12.625C6.12132 12.625 6.625 12.1213 6.625 11.5C6.625 10.8787 6.12132 10.375 5.5 10.375C4.87868 10.375 4.375 10.8787 4.375 11.5C4.375 12.1213 4.87868 12.625 5.5 12.625Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="mail_display">
                <div class="header">
                    <div class="toolbar left">
                        <div data-name="Junk" class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-archive-x mr-2 h-4 w-4"><rect width="20" height="5" x="2" y="3" rx="1"></rect><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path><path d="m9.5 17 5-5"></path><path d="m9.5 12 5 5"></path></svg>
                        </div>
                        <div data-name="Archive" class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-archive mr-2 h-4 w-4"><rect width="20" height="5" x="2" y="3" rx="1"></rect><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path><path d="M10 12h4"></path></svg>
                        </div>
                        <div data-name="Trash" class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 h-4 w-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                        </div>
                        <div data-name="Snooze" class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock h-4 w-4"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        </div>
                    </div>
                    <div class="toolbar right">
                        <div data-name="Reply" class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-reply h-4 w-4"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
                        </div>
                        <div data-name="Reply all" class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-reply-all h-4 w-4"><polyline points="7 17 2 12 7 7"></polyline><polyline points="12 17 7 12 12 7"></polyline><path d="M22 18v-2a4 4 0 0 0-4-4H7"></path></svg>
                        </div>
                        <div data-name="Forward" class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-forward h-4 w-4"><polyline points="15 17 20 12 15 7"></polyline><path d="M4 18v-2a4 4 0 0 1 4-4h12"></path></svg>
                        </div>
                        <div data-name="More" class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis-vertical h-4 w-4"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                        </div>
                    </div>
                </div> 
                <div class="head">
                    <profile-icon data-name="quan pham"></profile-icon>
                    <div class="info_container">
                        <div class="heading">
                            <span class="name"></span>
                            <span class="date">july 19, 1996</span>
                        </div>
                        <div class="subject">need a hand</div>
                        <div class="reply_address">jade@softhands.com</div>
                    </div>
                </div>
                <div class="body"></div>
                <div class="reply_container">
                    <textarea id="reply" placeholder="Type your message here..."></textarea>
                    <div class="submit_container">
                        <shad-toggle data-label="Mute this thread"></shad-toggle>
                        <button is="shad-button" id="send_message">Send</button>
                    </div>
                    
                </div>
            </div>
        `;
        const shadow = this.attachShadow({mode: "open"});
        shadow.appendChild(template.content.cloneNode(true));
        this.resizeContainer = shadow.querySelector(".resize_container");
        this.navContainer = shadow.querySelector(".nav_container");
        this.nav = shadow.querySelector("icon-nav");
        this.preview = shadow.querySelector(".preview_window");
        this.display = shadow.querySelector(".mail_display");
        this.handle = shadow.querySelector(".resize_handle");
        this.selectedMessage = null;

        this.nav.addEventListener("nav-items-loaded", this.activateNav);
        this.addEventListener("nav-entry-selected", this.handleNavSelection);
        this.addEventListener("message-preview-selected", this.handleMessageSelection);
    }
    connectedCallback() {
        this.activateHandle();
        this.activateReply();
        //this.setMailDisplay();
    }
    handleNavSelection = (event) => {
        const navEntry = event.detail;
        const title = this.preview.querySelector(".header .title");
        title.textContent = navEntry.querySelector(".name").textContent;
        console.log(title);
    }
    handleMessageSelection = (event) => {
        const message_preview = event.detail;
        //console.log(message_preview);
        if (this.selectedMessage) {
            this.selectedMessage.removeAttribute("active");
        } 
        this.selectedMessage = message_preview;
        this.selectedMessage.setAttribute("active", "");
        this.updateMessageDisplay(message_preview);
    }
    updateMessageDisplay(message) {
        const display = this.display;
        const profileIcon = display.querySelector("profile-icon");
        const name = message.getAttribute("data-name");
        display.querySelector(".name").textContent = name;
        display.querySelector(".body").textContent = message.textContent;
        display.querySelector(".subject").textContent = message.getAttribute("data-subject");
        profileIcon.setAttribute("data-name", name);
        profileIcon.setInitials();

    }
    setMailDisplay() {
        const body = this.display.querySelector(".body");
        body.style.maxHeight = `${body.clientHeight}px`;
        this.display.style.maxHeight = `${this.display.clientHeight}px`;
    }
    activateHandle() {
        const handle = this.handle;
        handle.addEventListener("mousedown", (event) => {
            document.body.style.userSelect = "none";
            document.body.style.cursor = "ew-resize";
            this.handle.style.cursor = "ew-resize";
            document.addEventListener("mousemove", this.resize);
        });
        document.addEventListener("mouseup", this.disengageMouse);
        document.addEventListener("mouseout", this.disengageMouse);
    }
    activateReply() {
        const textarea = this.shadowRoot.getElementById("reply");
        textarea.addEventListener("input", function() {
            this.style.height = "auto";
            this.style.height = `${this.scrollHeight}px`;
        });
    }
    resize = (event) => {
        if (this.nav.hasAttribute("collapsed")) {
            this.navContainer.style.flexGrow = "0";
        } else {//${this.nav.widthThreshold}px
            this.nav.style.setProperty("width", `100%`);
            this.navContainer.style.flexGrow = "1";
        }

        const containerRect = this.getBoundingClientRect();

        const containerDistanceFromLeft = event.clientX - containerRect.left;
        const containerDistanceFromRight = containerRect.right - event.clientX; 

        if (containerDistanceFromRight > 250 && containerDistanceFromLeft > 350) {
            this.resizeContainer.style.width = `${containerDistanceFromLeft}px`;
            this.display.style.width = `${containerDistanceFromRight}px`;
        }  
    }
    disengageMouse = () => {
        this.nav.style.setProperty("width", `${this.nav.getBoundingClientRect().width}px`);
        this.navContainer.style.flexGrow = "0";
        document.body.style.cursor = "";
        this.handle.style.cursor = "";
        document.body.style.userSelect = "";
        document.removeEventListener("mousemove", this.resize);
    }
}
customElements.define("mail-app", MailApp);

class MessagePreview extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    padding: 0.5rem;
                    gap: 0.5rem;
                    border: 1px solid #303030;
                    background-color: black;
                    border-radius: 8px;
                    color: #808080;

                    
                }
                :host([active]) {
                    background-color: #303030;
                }
                :host(:hover) {
                    background-color: #303030;
                    cursor: pointer;
                }
                * {
                    font-size: 0.75rem;
                }
                
                .header {
                    display: flex;
                    justify-content: space-between;

                    & .name {
                        font-size: 1rem;
                        color: white;
                    }
                }
                .subject {
                    color: white;
                }
                .body {
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    
                    overflow: hidden;
                    line-height: 1.2em; 
                    height: calc(1.2em * 2);
                    
                    text-overflow: ellipsis;
                }
            </style>
            <div class="header">
                <span class="name"></span>
                <span class="date"></span>
            </div>
            <div class="subject"></div>
            <div class="body">
                <slot></slot>
            </div>
            <div class="tags">
                <span>work</span>
                <span>important</span>
            <div>
        `;
        const shadow = this.attachShadow({mode: "open"});
        shadow.appendChild(template.content.cloneNode(true));
        this.name = shadow.querySelector(".name");
        this.subject = shadow.querySelector(".subject");
        this.date = shadow.querySelector(".date");

        this.addEventListener("click", this.handleClick);
    }
    connectedCallback() {
        this.name.textContent = this.getAttribute("data-name");
        this.subject.textContent = this.getAttribute("data-subject");
        this.setTimeAgo();
    }
    setTimeAgo() {
        this.date.textContent = "at some time";
    }
    handleClick = (event) => {
        const clickEvent = new CustomEvent("message-preview-selected", {
            detail: this,
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(clickEvent);
    }
}
customElements.define("message-preview", MessagePreview);
