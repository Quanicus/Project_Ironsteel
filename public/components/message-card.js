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
        <span class="name">timmy</span>
        <span class="message_age">8 months ago</span>
    </div>
    <div class="subject">send help urgent</div>
    <div class="body">
        <slot></slot>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ullamcorper, erat eget eleifend varius, metus ex luctus quam, eu egestas arcu nisi in lacus. Quisque ultrices ante nibh, at elementum nunc imperdiet id. Nulla ornare velit sed ex laoreet pretium. Vestibulum elementum lorem dui, eu placerat metus dapibus rutrum. Nullam imperdiet semper mauris, sed tristique orci sagittis ac. Suspendisse ultrices libero non tellus venenatis, in tincidunt mauris vulputate. In aliquam, ligula tempus tempus convallis, tortor nunc faucibus enim, eget luctus mi nisi non justo. Donec auctor pulvinar pellentesque. Suspendisse dolor massa, condimentum vitae convallis a, consectetur ac tortor. Aenean eget consectetur diam. Sed vel erat at eros euismod vulputate accumsan ut nunc. Etiam purus libero, rutrum non aliquet consectetur, feugiat sed lacus. Nulla nunc dolor, tincidunt a dignissim ac, iaculis non tellus. Duis facilisis lobortis augue ut faucibus. Sed aliquam turpis ligula, varius blandit arcu ornare nec. Vestibulum semper, ipsum vel vehicula aliquam, libero augue luctus lorem, id tincidunt neque sapien nec neque.
    </div>
    <div class="tags">
        <span>work</span>
        <span>important</span>
    <div>
`;
class MessageCard extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: "open"});
        shadow.appendChild(template.content.cloneNode(true));
        this.body = shadow.querySelector(".body");

    }
}
customElements.define("message-card", MessageCard);