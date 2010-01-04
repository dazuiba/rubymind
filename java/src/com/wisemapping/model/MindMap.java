/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

// ...........................................................................................................
// (C) Copyright  1996/2007 Fuego Inc.  All Rights Reserved
// THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Fuego Inc.
// The copyright notice above does not evidence any actual or intended
// publication of such source code.
//
// Last changed on 2007-08-01 19:08:21 (-0300), by: imanzano. $Revision$
// ...........................................................................................................

package com.wisemapping.model;

import java.io.CharArrayReader;
import java.io.CharArrayWriter;
import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.logging.Logger;

import javax.xml.bind.JAXBException;

import com.wisemapping.util.ZipUtils;
import com.wisemapping.xml.VmlToSvgConverter;

public class MindMap {

    //~ Instance fields ......................................................................................

    final Logger logger = Logger.getLogger(MindMap.class.getName());
    private Calendar creationTime;
    private String creator;
    private String description;

    private int id;
    private boolean isPublic;
    private Calendar lastModificationTime;
    private String lastModifierUser;

    private MindMapNative nativeBrowser;
    private String properties;
    private String tags;
    private String title;
    private byte[] xml;

    public static void main(String argv[]) {

        String xml = "pepe\n hole";
        xml = xml.replace("'", "\\'");
        xml = xml.replace("\n", "");
        xml = xml.trim();

        System.out.println("xml:" + xml);

    }

    //~ Constructors .........................................................................................

    public MindMap() {
    }


    //~ Methods ..............................................................................................

    public void setXml(byte[] xml) {
        this.xml = xml;
    }

    public byte[] getXml() {
        return xml;
    }

    public String getUnzippedXml()
            throws IOException {
        return ZipUtils.zipToString(xml);
    }

    public void setProperties(String properties) {
        this.properties = properties;
    }

    public String getProperties() {
        String ret;
        if (properties == null) {
            ret = "{zoom:0.7,saveOnLoad:true}";
        } else {
            ret = properties;
        }

        return ret;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }

    public Calendar getLastModificationTime() {
        return lastModificationTime;
    }

    public Date getLastModificationDate() {
        return new Date();
    }

    public void setLastModificationTime(Calendar lastModificationTime) {
        this.lastModificationTime = lastModificationTime;
    }

    public String getLastModifierUser() {
        return lastModifierUser;
    }

    public void setLastModifierUser(String lastModifierUser) {
        this.lastModifierUser = lastModifierUser;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creatorUser) {
        this.creator = creatorUser;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getNativeXml()
            throws IOException {
        return getUnzippedXml();
    }


    public String getNativeXmlAsJsLiteral()
            throws IOException {
        String xml = getNativeXml();
        if (xml != null) {
            xml = xml.replace("'", "\\'");
            xml = xml.replace("\n", "");
            xml = xml.trim();
        }
        return xml;
    }

    public void setNativeXml(String nativeXml)
            throws IOException {
        this.xml = ZipUtils.stringToZip(nativeXml);
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getTags() {
        return tags;
    }

    public char[] generateSvgXml()
            throws IOException, JAXBException {
        final MindMapNative mindmapNativeBrowser = this.getNativeBrowser();
        String svgText = mindmapNativeBrowser.getUnzippedSvgXml();

        if (svgText == null || svgText.length() == 0) {
            // The map must be saved using IE. Convert VML to SVG.

            // Add namespace to the converter ...
            String vmlXml = mindmapNativeBrowser.getUnzippedVmlXml();
            vmlXml = vmlXml.replaceFirst("<v:group ", "<v:group xmlns:v=\"http://wisemapping.com/xml/vmlmap\" ");

            char[] bytes = vmlXml.toCharArray();
            final CharArrayReader is = new CharArrayReader(bytes);

            // Convert Map ...
            final VmlToSvgConverter converter = new VmlToSvgConverter();
            converter.convert(is);

            final CharArrayWriter os = new CharArrayWriter();
            converter.toXml(os);

            return os.toCharArray();
        } else {
            String result = "<?xml version='1.0' encoding='UTF-8'?>\n" + svgText;

            // Add namespace...
            result = result.replaceFirst("<svg ", "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" ");
            result = result.replaceAll("<image([^>]+)>", "<image$1/>");

            return result.toCharArray();
        }
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Calendar getCreationTime() {
        return creationTime;
    }

    public void setCreationTime(Calendar creationTime) {
        this.creationTime = creationTime;
    }


    public MindMapNative getNativeBrowser() {
        return nativeBrowser;
    }

    public void setNativeBrowser(MindMapNative nativeBrowser) {
        this.nativeBrowser = nativeBrowser;
    }
}
