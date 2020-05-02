=======================
README of host_registry
=======================


Presentation
============

This repository contains experimental code for replacing *reverse-proxy* with *port-redirection*.

More information under readthdocs_

.. _readthedocs : https://host-registry.readthedocs.io/en/latest/


Getting started
===============

In a bash-terminal::

  git clone https://github.com/charlyoleg/host_registry
  cd host_registry
  npm i
  npm run start_hrs


In a second bash-terminal::

  curl -k https://ZZZ.LocalHost:8443/aa



Common tasks
============

Update the server::

  pm2 stop rediry
  git pull
  npm run build_hrs
  pm2 restart rediry



Update the access_log-report::

  npm run accesslog_html


and visit the page accesslog_report_

.. _accesslog_report: https://accyloggy.billet.ovh




