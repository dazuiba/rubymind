import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;

import javax.xml.bind.JAXBException;

import com.wisemapping.exporter.ExportException;
import com.wisemapping.exporter.freemind.FreemindExporter;
import com.wisemapping.importer.ImporterException;
import com.wisemapping.importer.freemind.FreemindImporter;
import com.wisemapping.model.MindMap;
import com.wisemapping.model.MindMapNative;

public class MMap {
	public static void main(String[] args) throws Exception {
		
		String mm = "D:/dev/lib/wise-source//test.mm";
		String str = readFile(mm);
		//test1(str);
		//testExport();
		
		testImport(mm);
	}

	private static void testImport(String mm) throws ImporterException, Exception, JAXBException {
		FreemindImporter exporter = new FreemindImporter();
		MindMap mmap = exporter.importMap("dd", "dd2", new FileInputStream(mm));
		System.out.println(readFile(mm));
		System.out.println(mmap.getNativeXml());		
		
	}

	private static void testExport() throws FileNotFoundException, ExportException {
		FreemindExporter export = new FreemindExporter();
		byte[] xml = readFile("D:/dev/lib/wise-source//test.mm").getBytes();
		export.export(xml, System.out);
	}

	private static void test1(String str) throws Exception {
		MindMap map = new MindMap();
        MindMapNative nativeBrowser = map.getNativeBrowser();

        map.setNativeXml(str);
        map.setTitle("dd");
        map.setNativeBrowser(new MindMapNative());
		System.out.println(map.generateSvgXml());	
	}

	public static String readFile(String fileName) {
		StringBuffer buffer  = new StringBuffer();
		try {
			FileReader fr = new FileReader(fileName);
			BufferedReader br = new BufferedReader(fr);// Can also use a Scanner
			String line = null;
			while ((line=br.readLine()) != null) {
					buffer.append(line);
			}
		} catch (FileNotFoundException fN) {
			fN.printStackTrace();
		} catch (IOException e) {
			System.out.println(e);
		}
		return buffer.toString();
	}
}
