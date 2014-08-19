define(function (require, exports, module) {
    exports.large = [
        {
            item: 'headerView',
            attribute: 'width',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.5
        },
        {
            item: 'headerView',
            attribute: 'height',
            constant: 125,
            relatedBy: '==',
        },
        {
            item: 'headerView',
            attribute: 'left',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.25
        },
        {
            item: 'headerView',
            attribute: 'right',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.25
        },
        {
            item: 'headerView',
            attribute: 'top',
            constant: 30,
            relatedBy: '==',
        },

        // scrollview
        {
            item: 'scrollview',
            attribute: 'width',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.5
        },
        {
            item: 'scrollview',
            attribute: 'left',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.25
        },
        {
            item: 'scrollview',
            attribute: 'right',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.25
        },
        {
            item: 'scrollview',
            attribute: 'top',
            toItem: 'headerView',
            toAttribute: 'bottom',
            relatedBy: '==',
        },
        {
            item: 'scrollview',
            attribute: 'height',
            toItem: 'superview',
            toAttribute: 'height',
            relatedBy: '==',
            multiplier: 1,
            constant: -300
        },

        // footer
        {
            item: 'footerView',
            attribute: 'width',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.5
        },
        {
            item: 'footerView',
            attribute: 'left',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.25
        },
        {
            item: 'footerView',
            attribute: 'right',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.25
        },
        {
            item: 'footerView',
            attribute: 'top',
            relatedBy: '==',
            toItem: 'scrollview',
            toAttribute: 'bottom',
            multiplier: 1,
            constant: 15
        },

        {
            item: 'footerView',
            attribute: 'height',
            constant: 50,
            relatedBy: '==',
        },
    ];

    exports.medium = [
        {
            item: 'headerView',
            attribute: 'width',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.5
        },
        {
            item: 'headerView',
            attribute: 'height',
            constant: 125,
            relatedBy: '==',
        },
        {
            item: 'headerView',
            attribute: 'left',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.25
        },
        {
            item: 'headerView',
            attribute: 'right',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.25
        },
        {
            item: 'headerView',
            attribute: 'top',
            constant: 30,
            relatedBy: '==',
        },

        // scrollview
        {
            item: 'scrollview',
            attribute: 'width',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.5
        },
        {
            item: 'scrollview',
            attribute: 'left',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.25
        },
        {
            item: 'scrollview',
            attribute: 'right',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.25
        },
        {
            item: 'scrollview',
            attribute: 'top',
            toItem: 'headerView',
            toAttribute: 'bottom',
            relatedBy: '==',
        },
        {
            item: 'scrollview',
            attribute: 'height',
            toItem: 'superview',
            toAttribute: 'height',
            relatedBy: '==',
            multiplier: 1,
            constant: -300
        },

        // footer
        {
            item: 'footerView',
            attribute: 'width',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.5
        },
        {
            item: 'footerView',
            attribute: 'left',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.25
        },
        {
            item: 'footerView',
            attribute: 'right',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.25
        },
        {
            item: 'footerView',
            attribute: 'top',
            relatedBy: '==',
            toItem: 'scrollview',
            toAttribute: 'bottom',
            multiplier: 1,
            constant: 15
        },

        {
            item: 'footerView',
            attribute: 'height',
            constant: 50,
            relatedBy: '==',
        },
    ];

    exports.small = [
        {
            item: 'headerView',
            attribute: 'width',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.5
        },
        {
            item: 'headerView',
            attribute: 'height',
            constant: 125,
            relatedBy: '==',
        },
        {
            item: 'headerView',
            attribute: 'left',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.25
        },
        {
            item: 'headerView',
            attribute: 'right',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.25
        },
        {
            item: 'headerView',
            attribute: 'top',
            constant: 30,
            relatedBy: '==',
        },

        // scrollview
        {
            item: 'scrollview',
            attribute: 'width',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.5
        },
        {
            item: 'scrollview',
            attribute: 'left',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.25
        },
        {
            item: 'scrollview',
            attribute: 'right',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.25
        },
        {
            item: 'scrollview',
            attribute: 'top',
            toItem: 'headerView',
            toAttribute: 'bottom',
            relatedBy: '==',
        },
        {
            item: 'scrollview',
            attribute: 'height',
            toItem: 'superview',
            toAttribute: 'height',
            relatedBy: '==',
            multiplier: 1,
            constant: -300
        },

        // footer
        {
            item: 'footerView',
            attribute: 'width',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.5
        },
        {
            item: 'footerView',
            attribute: 'left',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.25
        },
        {
            item: 'footerView',
            attribute: 'right',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.25
        },
        {
            item: 'footerView',
            attribute: 'top',
            relatedBy: '==',
            toItem: 'scrollview',
            toAttribute: 'bottom',
            multiplier: 1,
            constant: 15
        },

        {
            item: 'footerView',
            attribute: 'height',
            constant: 50,
            relatedBy: '==',
        },
    ];
});
