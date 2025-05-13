Component({

    data: {
        blocks: [1,2,3], 
    },

    methods: {
        onTabsChange(event) {
            console.log(`Change tab, tab-panel value is ${event.detail.value}.`);
        },

        onTabsClick(event) {
            console.log(`Click tab, tab-panel value is ${event.detail.value}.`);
        },

        handleBack() {
            console.log('go back');
        },
    },
});