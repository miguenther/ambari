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
package org.apache.ambari.server.controller;

import java.util.List;
import java.util.Map;

/**
 * This class encapsulates a configuration update request.
 * The configuration properties are grouped at service level. It is assumed that
 * different components of a service don't overload same property name.
 */
public class ConfigurationResponse {

  private final String clusterName;
  
  private final List<PerConfigurationResponse> configs;
  
  public ConfigurationResponse(String clusterName,
      List<PerConfigurationResponse> configs) {
    super();
    this.clusterName = clusterName;
    this.configs = configs;
  }

  public static class PerConfigurationResponse {
    
    private final String type;
    
    private String versionTag;
    
    private Map<String, String> configs;

    public PerConfigurationResponse(String type, String versionTag,
        Map<String, String> configs) {
      super();
      this.type = type;
      this.versionTag = versionTag;
      this.configs = configs;
    }

    /**
     * @return the versionTag
     */
    public String getVersionTag() {
      return versionTag;
    }

    /**
     * @param versionTag the versionTag to set
     */
    public void setVersionTag(String versionTag) {
      this.versionTag = versionTag;
    }

    /**
     * @return the configs
     */
    public Map<String, String> getConfigs() {
      return configs;
    }

    /**
     * @param configs the configs to set
     */
    public void setConfigs(Map<String, String> configs) {
      this.configs = configs;
    }

    /**
     * @return the type
     */
    public String getType() {
      return type;
    }
    
  }

  /**
   * @return the clusterName
   */
  public String getClusterName() {
    return clusterName;
  }

  /**
   * @return the configs
   */
  public List<PerConfigurationResponse> getConfigs() {
    return configs;
  }
  
}