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

package org.apache.ambari.server.api.resources;

import org.apache.ambari.server.controller.spi.PropertyId;
import org.apache.ambari.server.controller.spi.Resource;

import java.util.*;

/**
 * Service resource definition.
 */
public class ServiceResourceDefinition extends BaseResourceDefinition {

  /**
   * value of cluster id foreign key
   */
  private String m_clusterId;

  /**
   * Constructor.
   *
   * @param id        service id value
   * @param clusterId cluster id value
   */
  public ServiceResourceDefinition(String id, String clusterId) {
    super(Resource.Type.Service, id);
    m_clusterId = clusterId;
    setResourceId(Resource.Type.Cluster, m_clusterId);
  }

  @Override
  public String getPluralName() {
    return "services";
  }

  @Override
  public String getSingularName() {
    return "service";
  }

  @Override
  public Map<String, ResourceDefinition> getSubResources() {
    Map<String, ResourceDefinition> mapChildren = new HashMap<String, ResourceDefinition>();
    // for component collection need id property
    ComponentResourceDefinition componentResourceDefinition =
        new ComponentResourceDefinition(null, m_clusterId, getId());
    PropertyId componentIdProperty = getClusterController().getSchema(
        Resource.Type.Component).getKeyPropertyId(Resource.Type.Component);
    componentResourceDefinition.getQuery().addProperty(componentIdProperty);
    mapChildren.put(componentResourceDefinition.getPluralName(), componentResourceDefinition);
    return mapChildren;
  }
}
