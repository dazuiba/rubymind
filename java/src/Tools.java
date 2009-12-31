import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

import javax.xml.bind.JAXBException;

import com.wisemapping.importer.ImporterException;
import com.wisemapping.importer.freemind.FreemindImporter;
import com.wisemapping.model.ShapeStyle;
import com.wisemapping.util.JAXBUtils;
import com.wisemapping.xml.freemind.Map;
import com.wisemapping.xml.freemind.Node;
import com.wisemapping.xml.mindmap.TopicType;


public class Tools {
	 public static ByteArrayOutputStream mm_2_xml(InputStream input) throws  Exception {
         try {
             final Map freemindMap = (Map) JAXBUtils.getMapObject(input,"com.wisemapping.xml.freemind");

             final com.wisemapping.xml.mindmap.Map mindmapMap = new com.wisemapping.xml.mindmap.Map() ;

             final Node centralNode = freemindMap.getNode();
             final TopicType centralTopic = new TopicType();
             centralTopic.setCentral(true);

             FreemindImporter.setNodePropertiesToTopic(centralTopic,centralNode);
             centralTopic.setShape(ShapeStyle.ROUNDED_RETAGLE.getStyle());
             mindmapMap.getTopic().add(centralTopic);

             FreemindImporter.addTopicFromNode(centralNode,centralTopic);

             ByteArrayOutputStream out = new ByteArrayOutputStream();
             JAXBUtils.saveMap(mindmapMap,out,"com.wisemapping.xml.mindmap");
             return out;

         } catch (JAXBException e) {
             throw new ImporterException(e);
         }
    }
	 
	 public static void main(String[] args) throws Exception {
		 String s = "<map name=\"1\"><topic central=\"true\" text=\"Subject\"/></map>";
		System.out.println(Tools.mm_2_xml(new ByteArrayInputStream(s.getBytes())));
	}
}
