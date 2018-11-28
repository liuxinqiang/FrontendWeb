declare namespace TopUI {
    interface DropdownElement {
        show(): void;

        hide(force?: boolean): void;
    }

    type DropdownPosition =
        'bottom-left' |
        'bottom-center' |
        'bottom-right' |
        'top-left' |
        'top-center' |
        'top-right' |
        'left-top' |
        'left-center' |
        'left-bottom' |
        'right-top' |
        'right-center' |
        'right-bottom';

    interface DropdownOptions {
        pos?: DropdownPosition;
        mode?: 'hover' | 'click';
        remaintime?: number;
        justify?: string | false;
        boundary?: string | Window;
        delay?: number;
        dropdownSelector?: string;
        hoverDelayIdle?: number;
        preventflip?: 'x' | 'y' | boolean;
    }

    type Dropdown = (selector: string, options?: DropdownOptions) => DropdownElement;

    interface ModalElement {
        show(): void;

        hide(): void;

        isActive(): boolean;
    }

    interface ModalOptions {
        keyboard?: boolean;
        bgclose?: boolean;
        minScrollHeight?: number;
        center?: boolean;
        modal?: boolean;
    }

    interface Modal {
        alert(message: string): void;

        confirm(message: string, options?: ModalOptions): void;

        confirm(message: string, onconfirm: () => any, options?: ModalOptions): void;

        confirm(message: string, onconfirm: () => any, oncancel?: () => any, options?: ModalOptions): void;

        prompt(message: string, value: string, onsubmit?: (newValue: string) => any, options?: ModalOptions): void;

        blockUI(content: string, options?: ModalOptions): ModalElement;

        (selector: string, options?: ModalOptions): ModalElement;
    }

    interface OffCanvas {
        show(selector: string): void;

        hide(force?: boolean): void;
    }

    interface LightBoxOptions {
        group?: string;
        duration?: number;
        keyboard?: boolean;
    }

    interface LightBoxItem {
        source: string;
        type: string;
    }

    interface LightBoxElement {
        show(): void;
    }

    interface LightBox {
        create(items: LightBoxItem[]): LightBoxElement;

        (element: string, options?: LightBoxOptions): LightBoxElement;
    }

    type CallbackAutoComplete = () => string;

    interface AutoCompleteOptions {
        source?: string | string[] | CallbackAutoComplete;
        minLength?: number;
        param?: string;
        delay?: number;
    }

    type AutoComplete = (element: string, options?: AutoCompleteOptions) => any;

    interface DatePickerOptions {
        weekstart?: number;
        i18n?: {};
        format?: string;
        offsettop?: number;
        minDate?: string | boolean | number;
        maxDate?: string | boolean | number;
        pos?: string;
    }

    type DatePicker = (element: string, options?: DatePickerOptions) => any;

    interface HtmlEditorOptions {
        mode?: string;
        toolbar?: string[];
        maxsplitsize?: number;
        lblPreview?: string;
        lblCodeview?: string;
    }

    type HtmlEditor = (element: string, options?: HtmlEditorOptions) => any;

    interface SliderOptions {
        center?: boolean;
        threshold?: boolean;
        infinite?: boolean;
        activecls?: string;
        autoplay?: boolean;
        pauseOnHover?: boolean;
        autoplayInterval?: number;
    }

    type Slider = (element: string, options?: SliderOptions) => any;

    interface SlideSetOptions {
        default?: number;
        small?: number;
        medium?: number;
        large?: number;
        xlarge?: number;
        animation?: string;
        duration?: number;
        delay?: number;
        filter?: string;
        autoplay?: boolean;
        pauseOnHover?: boolean;
        autoplayInterval?: number;
    }

    type SlideSet = (element: string, options?: SlideSetOptions) => any;

    interface SlideShowOptions {
        animation?: string;

        duration?: number;

        height?: string;

        start?: number;

        autoplay?: boolean;

        pauseOnHover?: boolean;

        autoplayInterval?: number;

        videoautoplay?: boolean;

        videomute?: boolean;

        kenburns?: boolean;

        kenburnsanimations?: string;

        slices?: number;
    }

    type SlideShow = (element: string, options: SlideShowOptions) => any;

    interface ParallaxOptions {
        velocity?: number;
        target?: boolean;
        viewport?: number;
        media?: number | string;
    }

    type Parallax = (element: string, options: ParallaxOptions) => any;

    interface AccordionOptions {
        showfirst?: boolean;
        collapse?: boolean;
        animate?: boolean;
        easing?: string;
        duration?: number;
        toggle?: string;
        containers?: string;
        clsactive?: string;
    }

    type Accordion = (element: string, options: AccordionOptions) => any;

    interface NotificationOptions {
        message?: string;

        status?: string;

        timeout?: number;

        pos?: string;
    }

    interface Notification {
        (message: string, status?: string | NotificationOptions): any;

        (options: NotificationOptions): any;
    }

    interface SearchOptions {
        source?: string;

        minLength?: number;

        param?: string;

        delay?: number;
    }

    type Search = (element: string, options: SearchOptions) => any;

    interface NestableOptions {
        group?: string;
        maxDepth?: number;
        threshold?: number;
        listNodeName?: string;
        itemNodeName?: string;
        listBaseClass?: string;
        listClass?: string;
        listitemClass?: string;
        itemClass?: string;
        dragClass?: string;
        movingClass?: string;
        handleClass?: string;
        collapsedClass?: string;
        placeClass?: string;
        noDragClass?: string;
        emptyClass?: string;
    }

    type Nestable = (element: string, options: NestableOptions) => any;

    interface SortableOptions {
        group?: string;
        animation?: string;
        threshold?: string;
        handleClass?: string;
        dragCustomClass?: string;
    }

    type Sortable = (element: string, options: SortableOptions) => any;

    interface StickyOptions {
        top?: number;
        animation?: string;
        clsinit?: string;
        clsactive?: string;
        clsinactive?: string;
        getWidthFrom?: string;
        media?: number | string;
        target?: boolean;
        showup?: boolean;
        boundary?: boolean | string;
    }

    type Sticky = (element: string, options: StickyOptions) => any;

    interface TimepickerOptions {
        format?: string;
        start?: number;
        end?: number;
    }

    type Timepicker = (element: string, options: TimepickerOptions) => any;

    interface TooltipOptions {
        offset?: number;
        pos?: string;
        animation?: boolean;
        delay?: number;
        cls?: string;
        activeClass?: string;
    }

    type Tooltip = (element: string, options: TooltipOptions) => any;

    interface UploadOptions {
        action?: string;
        single?: boolean;
        param?: string;
        params?: {};
        allow?: string;
        filelimit?: number;
        'type'?: string;

        before?(settings: UploadOptions, files: string | string[]): any;

        beforeAll?(files: string | string[]): any;

        beforeSend?(xhr: XMLHttpRequest): any;

        progress?(percent: number): any;

        complete?(response: any, xhr: XMLHttpRequest): any;

        allcomplete?(response: any, xhr: XMLHttpRequest): any;

        notallowed?(file: string | string[], settings: UploadOptions): any;

        loadstart?(event: any): any;

        load?(event: any): any;

        loadend?(event: any): any;

        error?(event: any): any;

        abort?(event: any): any;

        readystatechange?(event: any): any;
    }

    type Toggle = (element: string) => any;

    type Upload = (element: string, options: UploadOptions) => any;
    const dropdown: Dropdown;
    const modal: Modal;
    const lightbox: LightBox;
    const offcanvas: OffCanvas;
    const autocomplete: AutoComplete;
    const datepicker: DatePicker;
    const htmleditor: HtmlEditor;
    const slider: Slider;
    const slideset: SlideSet;
    const slideshow: SlideShow;
    const parallax: Parallax;
    const accordion: Accordion;
    const notification: Notification;
    const search: Search;
    const nestable: Nestable;
    const sortable: Sortable;
    const sticky: Sticky;
    const timepicker: Timepicker;
    const tooltip: Tooltip;
    const uploadSelect: Upload;
    const uploadDrop: Upload;
    const toggle: Toggle;
}
