import UIKit
import Social
import UniformTypeIdentifiers

class ShareViewController: SLComposeServiceViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.title = "Share to Platnm"
    }
    
    override func isContentValid() -> Bool {
        return true
    }
    
    override func didSelectPost() {
        guard let extensionContext = self.extensionContext else {
            self.extensionContext!.completeRequest(returningItems: [], completionHandler: nil)
            return
        }
        
        handleSharedContent(extensionContext: extensionContext)
    }
    
    private func handleSharedContent(extensionContext: NSExtensionContext) {
        var sharedURL: URL?
        
        // Process each input item
        for item in extensionContext.inputItems {
            guard let extensionItem = item as? NSExtensionItem else { continue }
            
            // Check attachments
            guard let attachments = extensionItem.attachments else { continue }
            
            for attachment in attachments {
                // Try to load as URL
                if attachment.hasItemConformingToTypeIdentifier(UTType.url.identifier) {
                    attachment.loadItem(forTypeIdentifier: UTType.url.identifier, options: nil) { (data, error) in
                        if let url = data as? URL {
                            self.openAppWithURL(url: url, extensionContext: extensionContext)
                            return
                        } else if let urlString = data as? String, let url = URL(string: urlString) {
                            self.openAppWithURL(url: url, extensionContext: extensionContext)
                            return
                        }
                    }
                    return
                }
                
                // Try to load as plain text (might contain URL)
                if attachment.hasItemConformingToTypeIdentifier(UTType.plainText.identifier) {
                    attachment.loadItem(forTypeIdentifier: UTType.plainText.identifier, options: nil) { (data, error) in
                        if let text = data as? String {
                            // Try to extract URL from text
                            if let url = self.extractURL(from: text) {
                                self.openAppWithURL(url: url, extensionContext: extensionContext)
                                return
                            }
                        }
                        // If no URL found, dismiss
                        extensionContext.completeRequest(returningItems: [], completionHandler: nil)
                    }
                    return
                }
            }
        }
        
        // If we get here, no valid content found
        extensionContext.completeRequest(returningItems: [], completionHandler: nil)
    }
    
    private func extractURL(from text: String) -> URL? {
        // Use NSDataDetector to find URLs in text
        let detector = try? NSDataDetector(types: NSTextCheckingResult.CheckingType.link.rawValue)
        let matches = detector?.matches(in: text, options: [], range: NSRange(location: 0, length: text.utf16.count))
        return matches?.first?.url
    }
    
    private func openAppWithURL(url: URL, extensionContext: NSExtensionContext) {
        // Create deep link URL
        let deepLinkURL = URL(string: "platnm://shared-music?url=\(url.absoluteString.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")")!
        
        // Use openURL to launch the app
        var responder: UIResponder? = self
        while responder != nil {
            if responder?.responds(to: #selector(openURL(_:))) == true {
                responder?.perform(#selector(openURL(_:)), with: deepLinkURL)
                break
            }
            responder = responder?.next
        }
        
        // Dismiss the extension
        extensionContext.completeRequest(returningItems: [], completionHandler: nil)
    }
    
    @objc private func openURL(_ url: URL) {
        // This will be called by the system to open the URL
    }
    
    override func configurationItems() -> [Any]! {
        return []
    }
}
