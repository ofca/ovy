var Benchmark = require('benchmark').Benchmark;
var Oxy = require('../oxygen');
var jsface = require('jsface');


var suite = new Benchmark.Suite('benchmark');

// OxygenJS Define
var OxyPerson = Oxy.define({
    constructor: function(name) {
        this.name = name;
    },
    setAddress: function(country, city, street) {
        this.country = country;
        this.city = city;
        this.street = street;
    }
});

var OxyChinaGuy = Oxy.define({
    extend: OxyPerson,
    constructor: function(name) {
        OxyChinaGuy.$superclass.call(this, name)
    },
    setAddress: function(city, street) {
        OxyChinaGuy.$super.setAddress.call(this, 'China', city, street);
    }
});

var OxyBeijingLover = Oxy.define({
    extend: OxyChinaGuy,
    constructor: function(name) {
        OxyBeijingLover.$superclass.call(this, name);
    },
    setAddress: function(street) {
        OxyBeijingLover.$super.setAddress.call(this, 'Beijing', street);
    }
});

//
//
//function test_oxygen_extend() {
//    var Person = Oxy.extend(function() {
//        return {
//            constructor:function (name) {
//                this.name = name;
//            },
//            setAddress:function (country, city, street) {
//                this.country = country;
//                this.city = city;
//                this.street = street;
//            }
//        }
//    });
//
//    var ChinaGuy = Oxy.extend(Person, function(Person, parent) {
//        return {
//            constructor:function () {
//                Person.call(this)
//            },
//            setAddress:function (city, street) {
//                parent.setAddress('China', city, street);
//            }
//        }
//    });
//
//    var BeiJingLover = Oxy.extend(ChinaGuy, function (ChinaGuy, parent) {
//        return {
//            constructor:function (name) {
//                ChinaGuy.call(this, name);
//            },
//            setAddress:function (street) {
//                parent.setAddress('BeiJing', street);
//            }
//        }
//    });
//
//    var p1 = new Person("John");
//    p1.setAddress("US", "MT", "CH");
//
//    var p2 = new ChinaGuy("Leo");
//    p2.setAddress("MT", "CH");
//
//    var p3 = new BeiJingLover("Mary");
//    p3.setAddress("CH");
//}

//
//function test_oxygen_extend_augment() {
//    var Person = Oxy.extend(Object, function () {
//
//        this.setAddress = function (country, city, street) {
//            this.country = country;
//            this.city = city;
//            this.street = street;
//        }
//
//        return Person;
//
//        function Person(name) {
//            this.name = name;
//        }
//    });
//
//    var ChinaGuy = Oxy.extend(Person, function (Person, parent) {
//
//        this.setAddress = function (city, street) {
//            parent.setAddress('China', city, street);
//        }
//
//        return ChinaGuy;
//
//        function ChinaGuy() {
//            Person.call(this)
//        }
//    });
//
//    var BeiJingLover = Oxy.extend(ChinaGuy, function (ChinaGuy, parent) {
//        this.setAddress = function (street) {
//            parent.setAddress('BeiJing', street);
//        }
//        return BeijingLover;
//
//        function BeijingLover(name) {
//            ChinaGuy.call(this, name);
//        }
//    });
//
//    var p1 = new Person("John");
//    p1.setAddress("US", "MT", "CH");
//
//    var p2 = new ChinaGuy("Leo");
//    p2.setAddress("MT", "CH");
//
//    var p3 = new BeiJingLover("Mary");
//    p3.setAddress("CH");
//}
var JSFacePerson = jsface.Class({
    constructor:function (name) {
        this.name = name;
    },
    setAddress:function (country, city, street) {
        this.country = country;
        this.city = city;
        this.street = street;
    }
});

var JSFaceFrenchGuy = jsface.Class(JSFacePerson, {
    constructor:function (name) {
        JSFaceFrenchGuy.$super.call(this, name);
    },
    setAddress:function (city, street) {
        JSFaceFrenchGuy.$superp.setAddress.call(this, 'France', city, street);
    }
});

var JSFaceParisLover = jsface.Class(JSFaceFrenchGuy, {
    constructor:function (name) {
        JSFaceParisLover.$super.call(this, name);
    },
    setAddress:function (street) {
        JSFaceParisLover.$superp.setAddress.call(this, 'Paris', street);
    }
});

// Run Benchmark
(function () {
    // add tests
    suite
        .add('OxygenJS', function () {
            var p1 = new OxyPerson("John");
            p1.setAddress("US", "MT", "CH");

            var p2 = new OxyChinaGuy("Leo");
            p2.setAddress("MT", "CH");

            var p3 = new OxyBeijingLover("Mary");
            p3.setAddress("CH");
        })
//        .add('OxygenJS extend', function () {
//            test_oxygen_extend();
//        })
//        .add('OxygenJS extend(Augment style)', function() {
//            test_oxygen_extend_augment();
//        })
        .add('JSFace', function () {
            var p1 = new JSFacePerson("John");
            p1.setAddress("US", "MT", "CH");

            var p2 = new JSFaceFrenchGuy("Leo");
            p2.setAddress("MT", "CH");

            var p3 = new JSFaceParisLover("Mary");
            p3.setAddress("CH");
        })

        // add listeners
        .on('cycle', function (event) {
            console.log(String(event.target));
        })
        .on('complete', function () {
            console.log('Fastest is ' + this.filter('fastest').pluck('name'));
        })
        .on('error', function (event) {
            console.error(String(event.target));
        })
        // run async
        .run({ 'async':true });
})();
