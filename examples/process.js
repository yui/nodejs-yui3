YUI.add('process', function(Y) {

var netBinding = process.binding('net'),    
    child_process = YUI.require('child_process'),
    net = YUI.require('net'),    
    cwd = process.cwd(),
    isChild = false;
    
    process.argv.forEach(function(v) {
        if (v === '--child') {
            isChild = true;
        }
    });

    var Process = function() {
        Process.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Process, Y.Base, {
        _children: null,
        _spawnChild: function() {
            var fds = netBinding.socketpair();
            
            // Collect the child process arguments
            var args = process.argv.slice(1);
            args.push('--child');
            
            // Spawn the child process
            var child = child_process.spawn(
                process.argv[0],
                args,
                undefined,
                [fds[1], fds[2], fds[3]]
            );

            child.__pid = parseInt(child.pid);

            this._children[child.pid] = child;
            
            if (!child.stdin) {
                child.stdin = new net.Stream(fds[0], 'unix');
            }
            if (!child.stdout) {
                child.stdout = new net.Stream(fds[1], 'unix');
            }

            child.stdout.addListener('data', Y.bind(function(data) {
                var d = JSON.parse(data);
                Y.log('Message: ' + d.message, 'info', 'child[' + d.pid + ']');
                
                this.fire('message', d);
            }, this));
            return child;
        },
        message: function(str) {
            console.log(JSON.stringify({ pid: process.pid, message: str }));
        },
        _onServerSignal: function(signal) {
            Y.log('Killing all children with signal: '+ signal);
            Y.each(this._children, function(c) {
                try {
                    c.kill(signal);
                } catch (e) {}
            });
            process.exit();
        },
        _startServer: function() {
            var w = this.get('workers');
            for (var i = 0; i < w; i++) {
                this._spawnChild();
            }
            var self = this;
            ['SIGINT', 'SIGHUP', 'SIGTERM'].forEach(function(signal) {
                process.addListener(signal, Y.bind(self._onServerSignal, self, signal));
            });
            this.get('respawn');

            this.publish('sigchild', {
                defaultFn: this._sigChildFn
            });
            this.publish('sigcont', {
                defaultFn: this._sigContFn
            });
            this.publish('message', {
                emitFacade: false
            });
        },
        _sigChildFn: function(e) {
            Y.log('Child[' + e.child.__pid + '] died, spawning again.');
            this._spawnChild();
        },
        _onChildSig: function() {
            Y.each(this._children, function(c, i) {
                if (!c.pid) {
                    delete this._children[i];
                    this.fire('sigchild', { child: c });
                }
            }, this);
        },
        _sigContFn: function() {
            Y.log('SIGCONT Received Respawning all children');
            Y.each(this._children, function(c) {
                c.kill('SIGTERM');
            });
        },
        _onSigCont: function() {
            this.fire('sigcont');
        },
        _setRespawn: function() {
            Y.log('Adding respawn listeners');
            process.addListener('SIGCHLD', Y.bind(this._onChildSig, this));
            process.addListener('SIGCONT', Y.bind(this._onSigCont, this))
        },
        initializer: function() {
            this._children = {};
        },
        spawn: function() {
            if (this.get('child')) {
                this.fire('ready');
                Y.later((process.pid / 10), this, function() {
                    this.message('Child process holder exiting..');
                });
            } else {
                this._startServer();
            }
        }
    }, {
        ATTRS: {
            child: {
                value: isChild
            },
            respawn: {
                value: true,
                setter: '_setRespawn'
            },
            workers: {
                value: 5
            }
        }
    });
    
    Y.Process = Process;
});
