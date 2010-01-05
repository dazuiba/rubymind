/*
 * OOWeb
 *    
 * Copyright(c)2005, OOWeb developers (see the accompanying "AUTHORS" file)
 *
 * This software is licensed under the 
 * GNU LESSER GENERAL PUBLIC LICENSE, Version 2.1
 *    
 * For more information on distributing and using this program, please
 * see the accompanying "COPYING" file.
 */
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;

import net.sf.ooweb.http.FormEncodedFile;
import net.sf.ooweb.http.RequestState;
import net.sf.ooweb.http.ResponseState;
import net.sf.ooweb.http.Server;
import net.sf.ooweb.http.pygmy.OowebServer;
import net.sf.ooweb.objectmapping.Controller;
import net.sf.ooweb.objectmapping.Exclude;
import net.sf.ooweb.objectmapping.Secure;
import net.sf.ooweb.util.StringUtils;



/**
 * HelloWorld.  An example controller showing most of the basic OOWeb
 * interaction available to you.
 */
@Controller({"/", "/otherpath"})
public class WebServer {
	private final String template;

	public WebServer() {
		template = "<html><head><meta http-equiv='content-type' content='text/html; charset=UTF-8'>HTML_BODY</head><body> </body></html>";
	}

    public static void main(String[] args) throws Exception {
        Server s = new OowebServer();
        s.addController(new WebServer());
        s.start();
    }
    
    public String index() throws FileNotFoundException {
       return  withLayout("<form method=post action='mmap'>"+
    			"请粘贴mmap：<p><textarea  name='mmap' rows='30' cols='80'></textarea><p>"+
    			"<input type='submit'>"+
    		    "</form>");
    }

    public ResponseState mmap(RequestState state) throws Exception {
        Map params = state.getRequestArgs();
        String mmapStr =(String)params.get("mmap");
        ResponseState result = new ResponseState();
        result.setMimeType("text/xml");
        byte[] bytes = Tools.mm_2_xml(new ByteArrayInputStream(mmapStr.getBytes()) ).toByteArray();
        result.setBody(new ByteArrayInputStream(bytes));
        System.out.println(((List)result.getBody()).get(0).getClass());
        return result;
    } 
    
    private String withLayout(String body){
		return template.replaceFirst("HTML_BODY", body);
    }
    
    
}