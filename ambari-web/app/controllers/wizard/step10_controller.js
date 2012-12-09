/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var App = require('app');

App.WizardStep10Controller = Em.Controller.extend({
  name: 'wizardStep10Controller',
  clusterInfo: [],
  clearStep: function () {
    this.get('clusterInfo').clear();
  },

  loadStep: function () {
    console.log("TRACE: Loading step10: Summary Page");
    this.clearStep();
    this.loadInstalledHosts(this.loadRegisteredHosts());
    var installFlag = this.loadMasterComponents();
    var startFlag = this.loadStartedServices();
    if (installFlag && startFlag) {
      this.loadInstallTime();
    }
  },

  loadRegisteredHosts: function () {
    var masterHosts = this.get('content.masterComponentHosts').mapProperty('hostName').uniq();
    var slaveHosts = this.get('content.slaveComponentHosts');
    var hostObj = [];
    slaveHosts.forEach(function (_hosts) {
      hostObj = hostObj.concat(_hosts.hosts);
    }, this);
    slaveHosts = hostObj.mapProperty('hostname').uniq();
    var registeredHosts = masterHosts.concat(slaveHosts).uniq();
    var registerHostsStatement = registeredHosts.length + ' hosts registered to the cluster.';
    var registerHostsObj = Ember.Object.create({
      id: 1,
      displayStatement: registerHostsStatement,
      status: []
    });
    this.get('clusterInfo').pushObject(registerHostsObj);

    return registerHostsObj;
  },

  loadInstalledHosts: function (host) {
    var hosts = this.get('content.hostsInfo');
    var hostsInfo = [];
    for (var index in hosts) {
      hostsInfo.pushObject(hosts[index]);
      console.log('Step10 SUMMARY: value of hosts is: ' + hosts[index].status);
    }
    var succededHosts = hostsInfo.filterProperty('status', 'success');
    var warnedHosts = hostsInfo.filterProperty('status', 'warning').concat(hostsInfo.filterProperty('status', 'failed'));
    if (succededHosts.length) {
      var successStatement = succededHosts.length + ' nodes succeded completely to install and start all service components assigned to them.';
      this.get('clusterInfo').findProperty('id', 1).get('status').pushObject(Ember.Object.create({
        id: 1,
        displayStatement: successStatement
      }));
    }

    if (warnedHosts.length) {
      var warnStatement = warnedHosts.length + ' warnings';
      this.get('clusterInfo').findProperty('id', 1).get('status').pushObject(Ember.Object.create({
        id: 2,
        displayStatement: warnStatement,
        statements: []
      }));

      warnedHosts.forEach(function (_host) {
        var clusterState;
        console.log("Content.cluster.staus is: " + this.get('content.cluster.status'));
        if (this.get('content.cluster.status') === 'INSTALL FAILED') {
          clusterState = 'Installing ';
        } else if (this.get('content.cluster.status') === 'START FAILED') {
          clusterState = 'Starting ';
        }
        console.log('host value is: ' + JSON.stringify(_host));
        var failedTasks = _host.tasks.filterProperty('Tasks.status', 'FAILED');
        failedTasks.forEach(function (_task) {
          var taskStatement = clusterState + _task.Tasks.role + ' failed on ' + _host.name;
          console.log('Over here in SUMMARY page...');
          this.get('clusterInfo').findProperty('id', 1).get('status').findProperty('id', 2).get('statements').pushObject(Ember.Object.create({
            status: 'failed',
            displayStatement: taskStatement
          }));
        }, this);

        var abortedTasks = _host.tasks.filterProperty('Tasks.status', 'ABORTED');
        abortedTasks.forEach(function (_task) {
          var abortStatement = clusterState + _task.Tasks.role + ' aborted on ' + _host.name;
          this.get('clusterInfo').findProperty('id', 1).get('status').findProperty('id', 2).get('statements').pushObject(Ember.Object.create({
            status: 'aborted',
            displayStatement: abortStatement
          }));
        }, this);

        var timedOutTasks = _host.tasks.filterProperty('Tasks.status', 'TIMEDOUT');
        timedOutTasks.forEach(function (_task) {
          var abortStatement = clusterState + _task.Tasks.role + ' timed out on ' + _host.name;
          this.get('clusterInfo').findProperty('id', 1).get('status').findProperty('id', 2).get('statements').pushObject(Ember.Object.create({
            status: 'timedout',
            displayStatement: timedOutTasks
          }));
        }, this);
      }, this);
    }
  },

  loadMasterComponents: function () {
    var components = this.get('content.masterComponentHosts');
    var statement;
    if (this.get('content.cluster.status') === 'INSTALL FAILED') {
      this.get('clusterInfo').pushObject(Ember.Object.create({
        id: 2,
        displayStatement: 'Installing master services failed',
        status: []
      }));
      return false;
    } else {
      this.get('clusterInfo').pushObject(Ember.Object.create({
        id: 2,
        displayStatement: 'Master services installed',
        status: []
      }));
    }

    console.log('STEP10 master components:  ' + JSON.stringify(components));
    components.forEach(function (_component) {
      var component = Ember.Object.create(_component);
      switch (component.component) {
        case 'NAMENODE':
          this.loadNn(component);
          break;
        case 'SECONDARY_NAMENODE':
          this.loadSnn(component);
          break;
        case 'JOBTRACKER' :
          this.loadJt(component);
          break;
        case 'ZOOKEEPER_SERVER' :
          this.loadZk(component);
          break;
        case 'HBASE_MASTER':
          this.loadHb(component);
          break;
        case 'HIVE_SERVER':
          this.loadHiveServer(component);
          break;
        case 'OOZIE_SERVER':
          this.loadOozieServer(component);
          break;
        case 'GANGLIA_SERVER':
          this.loadGanglia(component)
          break;
        case 'NAGIOS_SERVER':
          this.loadNagios(component);
          break;
      }
    }, this);
    return true;
  },

  loadNn: function (component) {
    if (component.get('hostName')) {
      var statement = 'NameNode installed on ' + component.get('hostName');
      this.get('clusterInfo').findProperty('id', 2).get('status').pushObject(Ember.Object.create({
        id: 1,
        displayStatement: statement
      }));
    } else {
      console.log('ERROR: no host name assigned to NameNode component');
    }
  },

  loadSnn: function (component) {
    if (component.get('hostName')) {
      var statement = 'SecondaryNameNode installed on ' + component.get('hostName');
      this.get('clusterInfo').findProperty('id', 2).get('status').pushObject(Ember.Object.create({
        id: 1,
        displayStatement: statement
      }));
    } else {
      console.log('ERROR: no host name assigned to SecondaryNameNode component');
    }
  },

  loadJt: function (component) {
    if (component.get('hostName')) {
      var statement = 'JobTracker installed on ' + component.get('hostName');
      this.get('clusterInfo').findProperty('id', 2).get('status').pushObject(Ember.Object.create({
        id: 1,
        displayStatement: statement
      }));
    } else {
      console.log('ERROR: no host name assigned to JobTracker component');
    }
  },

  loadZk: function (component) {
    var hostLength = component.get('hostName').length;
    if (hostLength) {
      var hostVal;
      if (hostLength === 1) {
        hostVal = 'host';
      } else {
        hostVal = 'hosts';
      }
      var statement = 'ZooKeeper installed on ' + component.get('hostName').length + ' ' + hostVal;
      this.get('clusterInfo').findProperty('id', 2).get('status').pushObject(Ember.Object.create({
        id: 1,
        displayStatement: statement
      }));
    } else {
      console.log('ERROR: no host name assigned to Zookeeper component');
    }
  },

  loadHb: function (component) {
    if (component.get('hostName')) {
      var statement = 'HBase Master installed on ' + component.get('hostName');
      this.get('clusterInfo').findProperty('id', 2).get('status').pushObject(Ember.Object.create({
        id: 1,
        displayStatement: statement
      }));
    } else {
      console.log('ERROR: no host name assigned to HBase Master component');
    }
  },

  loadHiveServer: function (component) {
    if (component.get('hostName')) {
      var statement = 'Hive Metastore installed on ' + component.get('hostName');
      this.get('clusterInfo').findProperty('id', 2).get('status').pushObject(Ember.Object.create({
        id: 1,
        displayStatement: statement
      }));
    } else {
      console.log('ERROR: no host name assigned to Hive server component');
    }
  },

  loadOozieServer: function (component) {
    if (component.get('hostName')) {
      var statement = 'Hive Metastore installed on ' + component.get('hostName');
      this.get('clusterInfo').findProperty('id', 2).get('status').pushObject(Ember.Object.create({
        id: 1,
        displayStatement: statement
      }));
    } else {
      console.log('ERROR: no host name assigned to Oozie server component');
    }
  },

  loadGanglia: function (component) {
    if (component.get('hostName')) {
      var statement = 'Ganglia Server installed on ' + component.get('hostName');
      this.get('clusterInfo').findProperty('id', 2).get('status').pushObject(Ember.Object.create({
        id: 1,
        displayStatement: statement
      }));
    } else {
      console.log('ERROR: no host name assigned to Ganglia server component');
    }
  },

  loadNagios: function (component) {
    if (component.get('hostName')) {
      var statement = 'Ganglia Server installed on ' + component.get('hostName');
      this.get('clusterInfo').findProperty('id', 2).get('status').pushObject(Ember.Object.create({
        id: 1,
        displayStatement: statement
      }));
    } else {
      console.log('ERROR: no host name assigned to Nagios server component');
    }
  },

  loadStartedServices: function (component) {
    if (this.get('content.cluster.status') === 'STARTED') {
      var statement = 'All services started'
      this.get('clusterInfo').pushObject(Ember.Object.create({
        id: 3,
        displayStatement: 'All services started',
        status: []
      }));
      this.get('clusterInfo').pushObject(Ember.Object.create({
        id: 4,
        displayStatement: 'All tests passed',
        status: []
      }));
      return true;
    } else {
      this.get('clusterInfo').pushObject(Ember.Object.create({
        id: 3,
        displayStatement: 'Starting services failed',
        status: []
      }));
      return false;
    }
  },

  loadInstallTime: function() {
    var statement = 'Install and start of all services completed in '  + this.get('content.cluster.serviceStartTime') + ' minutes';
    this.get('clusterInfo').pushObject(Ember.Object.create({
      id: 5,
      displayStatement: statement,
      status: []
    }));
  }


});
