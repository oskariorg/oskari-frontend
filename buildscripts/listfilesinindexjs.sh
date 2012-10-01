#!/bin/bash
ppfx=$( dirname ${1} )"/../../../.."

function fixpath() {
    p=$( echo ${1} | sed 's/\/\//\//g' )
    while echo ${p} | egrep -q '\/[^./]+[^/]+\/\.\.\/'
    do
      p=$( echo ${p} | sed -r 's/\/[^./]+[^/]+\/\.\.\//\//' )
    done
    p=$( echo ${p} | sed -r 's/^Oskari\/\.\.\/Oskari/Oskari/' )
    ls ${p};
}


js -f /usr/local/bin/fakeoskari-startup.js -f ${1} \
    | while read level bpath
  do

  fixpath ${ppfx}/${bpath}/bundle.js

  js -f /usr/local/bin/fakeoskari-src.js -f ${ppfx}/${bpath}/bundle.js \
      | while read src
    do
    srcpath=$( echo ${ppfx}/${bpath}/${src} | sed 's/Oskari.*Oskari/Oskari/' );
    while echo ${srcpath} | egrep -q '\/[^./]+\/\.\.\/'
    do
      srcpath=$( echo ${srcpath} | sed -r 's/\/[^./]+\/\.\.\//\//' );
    done
    ls ${srcpath}
  done

  js -f /usr/local/bin/fakeoskari-locales.js -f ${ppfx}/${bpath}/bundle.js \
      | while read src
    do
    srcpath=$( echo ${ppfx}/${bpath}/${src} | sed 's/Oskari.*Oskari/Oskari/' );
    while echo ${srcpath} | egrep -q '\/[^./]+\/\.\.\/'
    do
      srcpath=$( echo ${srcpath} | sed -r 's/\/[^./]+\/\.\.\//\//' );
    done
    ls ${srcpath}
  done

done
