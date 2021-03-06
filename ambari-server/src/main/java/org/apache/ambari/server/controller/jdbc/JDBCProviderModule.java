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

package org.apache.ambari.server.controller.jdbc;

import org.apache.ambari.server.AmbariException;
import org.apache.ambari.server.controller.ganglia.GangliaPropertyProvider;
import org.apache.ambari.server.controller.internal.DefaultProviderModule;
import org.apache.ambari.server.controller.internal.URLStreamProvider;
import org.apache.ambari.server.controller.jmx.JMXPropertyProvider;
import org.apache.ambari.server.controller.spi.Predicate;
import org.apache.ambari.server.controller.spi.PropertyId;
import org.apache.ambari.server.controller.spi.PropertyProvider;
import org.apache.ambari.server.controller.spi.ProviderModule;
import org.apache.ambari.server.controller.spi.Request;
import org.apache.ambari.server.controller.spi.Resource;
import org.apache.ambari.server.controller.spi.ResourceProvider;
import org.apache.ambari.server.controller.utilities.DBHelper;
import org.apache.ambari.server.controller.utilities.PredicateBuilder;
import org.apache.ambari.server.controller.utilities.PropertyHelper;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * The default provider module implementation.
 */
public class JDBCProviderModule extends DefaultProviderModule {


  // ----- Constructors ------------------------------------------------------

  /**
   * Create a default provider module.
   */
  public JDBCProviderModule() {
    super();
  }

  // ----- utility methods ---------------------------------------------------

  @Override
  protected void createResourceProvider(Resource.Type type) {
    putResourceProvider( type, new JDBCResourceProvider(DBHelper.CONNECTION_FACTORY, type,
        PropertyHelper.getPropertyIds(type),
        PropertyHelper.getKeyPropertyIds(type)));
  }
}
