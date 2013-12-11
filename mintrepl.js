var repl = require('repl'),
    http = require('http'),
    vm = require('vm');


http.get({host: 'localhost', port: 3000, path: '/api/compile/modules/'+process.argv[2]+'/'}, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk){
        vm.runInThisContext(chunk);
        repl.start({
            prompt: "mint "+process.argv[2]+"> ",
            input: process.stdin,
            output: process.stdout
        });

    })
})


