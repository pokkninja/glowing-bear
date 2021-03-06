var weechat = angular.module('weechat');

describe('Filters', function() {
    beforeEach(module('weechat'));
    /*beforeEach(module(function($provide) {
        $provide.value('version', 'TEST_VER');
    }));*/

    it('has an irclinky filter', inject(function($filter) {
        expect($filter('irclinky')).not.toBeNull();
    }));

    describe('irclinky', function() {
        it('should not mess up text', inject(function(irclinkyFilter) {
            expect(irclinkyFilter('foo')).toEqual('foo');
        }));

        it('should linkify IRC channels', inject(function(irclinkyFilter) {
            expect(irclinkyFilter('#foo')).toEqual('<a href="#" onclick="var $scope = angular.element(event.target).scope(); $scope.openBuffer(\'#foo\'); $scope.$apply();">#foo</a>');
        }));

        it('should not mess up IRC channels surrounded by HTML entities', inject(function(irclinkyFilter) {
            expect(irclinkyFilter('<"#foo">')).toEqual('&lt;&quot;<a href="#" onclick="var $scope = angular.element(event.target).scope(); $scope.openBuffer(\'#foo&quot;&gt;\'); $scope.$apply();">#foo&quot;&gt;</a>');
        }));
    });

    describe('inlinecolour', function() {
        it('should not mess up normal text', inject(function(inlinecolourFilter) {
            expect(inlinecolourFilter('foo')).toEqual('foo');
            expect(inlinecolourFilter('test #foobar baz')).toEqual('test #foobar baz');
        }));

        it('should detect inline colours in #rrggbb format', inject(function(inlinecolourFilter) {
            expect(inlinecolourFilter('#123456')).toEqual('#123456 <div class="colourbox" style="background-color:#123456"></div>');
            expect(inlinecolourFilter('#aabbcc')).toEqual('#aabbcc <div class="colourbox" style="background-color:#aabbcc"></div>');
        }));

        it('should not detect inline colours in #rgb format', inject(function(inlinecolourFilter) {
            expect(inlinecolourFilter('#123')).toEqual('#123');
            expect(inlinecolourFilter('#abc')).toEqual('#abc');
        }));

        it('should detect inline colours in rgb(12,34,56) and rgba(12,34,56,0.78) format', inject(function(inlinecolourFilter) {
            expect(inlinecolourFilter('rgb(1,2,3)')).toEqual('rgb(1,2,3) <div class="colourbox" style="background-color:rgb(1,2,3)"></div>');
            expect(inlinecolourFilter('rgb(1,2,3);')).toEqual('rgb(1,2,3); <div class="colourbox" style="background-color:rgb(1,2,3);"></div>');
            expect(inlinecolourFilter('rgba(1,2,3,0.4)')).toEqual('rgba(1,2,3,0.4) <div class="colourbox" style="background-color:rgba(1,2,3,0.4)"></div>');
            expect(inlinecolourFilter('rgba(255,123,0,0.5);')).toEqual('rgba(255,123,0,0.5); <div class="colourbox" style="background-color:rgba(255,123,0,0.5);"></div>');
        }));

        it('should tolerate whitespace in between numbers in rgb/rgba colours', inject(function(inlinecolourFilter) {
            expect(inlinecolourFilter('rgb( 1\t, 2 ,  3 )')).toEqual('rgb( 1\t, 2 ,  3 ) <div class="colourbox" style="background-color:rgb( 1\t, 2 ,  3 )"></div>');
        }));

        it('should handle multiple and mixed occurrences of colour values', inject(function(inlinecolourFilter) {
            expect(inlinecolourFilter('rgb(1,2,3) #123456')).toEqual('rgb(1,2,3) <div class="colourbox" style="background-color:rgb(1,2,3)"></div> #123456 <div class="colourbox" style="background-color:#123456"></div>');
            expect(inlinecolourFilter('#f00baa #123456 #234567')).toEqual('#f00baa <div class="colourbox" style="background-color:#f00baa"></div> #123456 <div class="colourbox" style="background-color:#123456"></div> #234567 <div class="colourbox" style="background-color:#234567"></div>');
            expect(inlinecolourFilter('rgba(1,2,3,0.4) foorgb(50,100,150)')).toEqual('rgba(1,2,3,0.4) <div class="colourbox" style="background-color:rgba(1,2,3,0.4)"></div> foorgb(50,100,150) <div class="colourbox" style="background-color:rgb(50,100,150)"></div>');
        }));

        it('should not replace HTML escaped &#123456;', inject(function(inlinecolourFilter) {
            expect(inlinecolourFilter('&#123456;')).toEqual('&#123456;');
        }));
    });

});
