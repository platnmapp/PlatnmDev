import UIKit
import UniformTypeIdentifiers
import os.log

class ShareViewController: UIViewController {
    
    private var sharedURL: String?
    private var songTitle: String?
    private var songArtist: String?
    private var songArtwork: String?
    private var songTrackId: String?
    private var musicService: String = "spotify" // "spotify" or "apple"
    private let logger = OSLog(subsystem: "com.leonardodeltoro.platnm.app.ShareExtension", category: "ShareViewController")
    private let logIdentifier = "PLATNM_SHARE_EXT_2024" // Unique identifier for searching logs
    
    // Add init methods to catch instantiation
    override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
        super.init(nibName: nibNameOrNil, bundle: nibBundleOrNil)
        writeLogToFile("\(logIdentifier): ShareViewController.init(nibName:bundle:) CALLED")
        print("\(logIdentifier): ShareViewController.init(nibName:bundle:) CALLED")
        NSLog("\(logIdentifier): ShareViewController.init(nibName:bundle:) CALLED")
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        writeLogToFile("\(logIdentifier): ShareViewController.init(coder:) CALLED")
        print("\(logIdentifier): ShareViewController.init(coder:) CALLED")
        NSLog("\(logIdentifier): ShareViewController.init(coder:) CALLED")
    }
    
    deinit {
        writeLogToFile("\(logIdentifier): ShareViewController.deinit CALLED")
        print("\(logIdentifier): ShareViewController.deinit CALLED")
        NSLog("\(logIdentifier): ShareViewController.deinit CALLED")
    }
    
    // Helper to write logs to file (guaranteed to work)
    private func writeLogToFile(_ message: String) {
        let logMessage = "\(Date()): \(message)\n"
        if let containerURL = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: "group.com.platnm.5a1fixcuqweopqweopqwieopwqieopqwieoiqwopieopqiwopeiqwpoeioqwiepoqiwjdnaskncklnsdlfnlkas9635.app"),
           let data = logMessage.data(using: .utf8) {
            let logFileURL = containerURL.appendingPathComponent("share_extension_log.txt")
            if FileManager.default.fileExists(atPath: logFileURL.path) {
                if let fileHandle = try? FileHandle(forWritingTo: logFileURL) {
                    fileHandle.seekToEndOfFile()
                    fileHandle.write(data)
                    fileHandle.closeFile()
                }
            } else {
                try? data.write(to: logFileURL)
            }
        }
    }
    
    // UI Elements to match ShareExtension.tsx design
    private var scrollView: UIScrollView!
    private var songCard: UIView!
    private var albumArtImageView: UIImageView!
    private var songTitleLabel: UILabel!
    private var artistLabel: UILabel!
    private var searchBar: UISearchBar!
    private var friendsTableView: UITableView!
    private var shareButton: UIButton!
    private var selectedFriendIds: Set<String> = []
    private var friends: [FriendData] = []
    
    struct FriendData {
        let id: String
        let name: String
        let handle: String
        let avatarUrl: String?
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        writeLogToFile("\(logIdentifier): ====== SHARE EXTENSION viewDidLoad CALLED ======")
        
        // Force output to console immediately - multiple methods
        print("\(logIdentifier): ====== SHARE EXTENSION viewDidLoad CALLED ======")
        os_log("%{public}@: ====== SHARE EXTENSION viewDidLoad CALLED ======", log: logger, type: .info, logIdentifier)
        NSLog("\(logIdentifier): ====== SHARE EXTENSION viewDidLoad CALLED ======")
        NSLog("\(logIdentifier): viewDidLoad called")
        
        // Also write to stderr which is more reliable for extensions
        fputs("\(logIdentifier): viewDidLoad called\n", stderr)
        fflush(stderr)
        
        // CRITICAL DEBUG: Check if we have extension context
        if self.extensionContext == nil {
            writeLogToFile("\(logIdentifier): CRITICAL ERROR - extensionContext is NIL in viewDidLoad!")
            print("\(logIdentifier): CRITICAL ERROR - extensionContext is NIL in viewDidLoad!")
            NSLog("\(logIdentifier): CRITICAL ERROR - extensionContext is NIL in viewDidLoad!")
        } else {
            writeLogToFile("\(logIdentifier): extensionContext is available, inputItems count: \(extensionContext?.inputItems.count ?? 0)")
            print("\(logIdentifier): extensionContext is available, inputItems count: \(extensionContext?.inputItems.count ?? 0)")
        }
        
        view.backgroundColor = UIColor.black
        
        setupNavigationBar()
        setupUI()
        
        NSLog("\(logIdentifier): UI setup complete, loading shared content...")
        print("\(logIdentifier): UI setup complete, loading shared content...")
        
        // Show placeholder UI immediately so extension doesn't appear stuck
        songTitleLabel.text = "Loading..."
        artistLabel.text = "Fetching song details..."
        
        // Load shared content first
        loadSharedContent { [weak self] url in
            guard let self = self else { 
                print("\(self?.logIdentifier ?? "UNKNOWN"): loadSharedContent completion - self is nil")
                return 
            }
            if let url = url {
                self.sharedURL = url
                NSLog("\(self.logIdentifier): Loaded URL: \(url)")
                print("\(self.logIdentifier): Loaded URL: \(url)")
                
                // Update UI with URL info immediately (while metadata loads)
                DispatchQueue.main.async {
                    if url.contains("music.apple.com") {
                        NSLog("apple_share_debug: Setting UI for Apple Music")
                        print("apple_share_debug: Setting UI for Apple Music")
                        self.songTitleLabel.text = "Apple Music Track"
                        self.musicService = "apple"
                    } else {
                        self.songTitleLabel.text = "Spotify Track"
                        self.musicService = "spotify"
                    }
                    self.artistLabel.text = "Loading details..."
                }
                
                // Fetch music metadata from Supabase Edge Function (async, won't block UI)
                self.fetchMusicMetadata(urlString: url)
            } else {
                NSLog("\(self.logIdentifier): No URL found, dismissing")
                print("\(self.logIdentifier): No URL found, dismissing")
                self.dismissExtension()
            }
        }
        
        // Load friends in parallel
        loadFriends()
    }
    
    private func setupNavigationBar() {
        title = "Share to Platnm"
        navigationController?.navigationBar.barStyle = .black
        navigationController?.navigationBar.isTranslucent = false
        navigationController?.navigationBar.barTintColor = UIColor.black
        
        navigationItem.leftBarButtonItem = UIBarButtonItem(
            title: "Cancel",
            style: .plain,
            target: self,
            action: #selector(cancelTapped)
        )
        navigationItem.leftBarButtonItem?.tintColor = .white
    }
    
    @objc private func cancelTapped() {
        dismissExtension()
    }
    
    private func setupUI() {
        // Scroll View
        scrollView = UIScrollView()
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.backgroundColor = .black
        view.addSubview(scrollView)
        
        let contentView = UIView()
        contentView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentView)
        
        // Song Card (matching ShareExtension.tsx design)
        songCard = UIView()
        songCard.backgroundColor = UIColor(red: 0.055, green: 0.055, blue: 0.055, alpha: 1.0) // #0E0E0E
        songCard.layer.cornerRadius = 16
        songCard.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(songCard)
        
        // Album Art
        albumArtImageView = UIImageView()
        albumArtImageView.backgroundColor = .gray
        albumArtImageView.layer.cornerRadius = 8
        albumArtImageView.clipsToBounds = true
        albumArtImageView.contentMode = .scaleAspectFill
        albumArtImageView.translatesAutoresizingMaskIntoConstraints = false
        songCard.addSubview(albumArtImageView)
        
        // Song Title
        songTitleLabel = UILabel()
        songTitleLabel.text = "Loading..."
        songTitleLabel.textColor = .white
        songTitleLabel.font = UIFont.boldSystemFont(ofSize: 18)
        songTitleLabel.translatesAutoresizingMaskIntoConstraints = false
        songCard.addSubview(songTitleLabel)
        
        // Artist
        artistLabel = UILabel()
        artistLabel.text = "Artist"
        artistLabel.textColor = .gray
        artistLabel.font = UIFont.systemFont(ofSize: 14)
        artistLabel.translatesAutoresizingMaskIntoConstraints = false
        songCard.addSubview(artistLabel)
        
        // Search Bar
        searchBar = UISearchBar()
        searchBar.placeholder = "Search for Friends..."
        searchBar.barStyle = .black
        searchBar.searchBarStyle = .minimal
        searchBar.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(searchBar)
        
        // Friends Table View
        friendsTableView = UITableView()
        friendsTableView.backgroundColor = .black
        friendsTableView.separatorStyle = .none
        friendsTableView.delegate = self
        friendsTableView.dataSource = self
        friendsTableView.translatesAutoresizingMaskIntoConstraints = false
        friendsTableView.register(FriendTableViewCell.self, forCellReuseIdentifier: "FriendCell")
        contentView.addSubview(friendsTableView)
        
        // Share Button
        shareButton = UIButton(type: .system)
        shareButton.setTitle("Share", for: .normal)
        shareButton.backgroundColor = .white
        shareButton.setTitleColor(.black, for: .normal)
        shareButton.titleLabel?.font = UIFont.boldSystemFont(ofSize: 18)
        shareButton.layer.cornerRadius = 12
        shareButton.addTarget(self, action: #selector(shareButtonTapped), for: .touchUpInside)
        shareButton.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(shareButton)
        
        // Layout Constraints
        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scrollView.bottomAnchor.constraint(equalTo: shareButton.topAnchor, constant: -16),
            
            contentView.topAnchor.constraint(equalTo: scrollView.topAnchor),
            contentView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor),
            contentView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor),
            contentView.widthAnchor.constraint(equalTo: scrollView.widthAnchor),
            
            songCard.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 16),
            songCard.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            songCard.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            songCard.heightAnchor.constraint(equalToConstant: 80),
            
            albumArtImageView.leadingAnchor.constraint(equalTo: songCard.leadingAnchor, constant: 12),
            albumArtImageView.centerYAnchor.constraint(equalTo: songCard.centerYAnchor),
            albumArtImageView.widthAnchor.constraint(equalToConstant: 56),
            albumArtImageView.heightAnchor.constraint(equalToConstant: 56),
            
            songTitleLabel.leadingAnchor.constraint(equalTo: albumArtImageView.trailingAnchor, constant: 12),
            songTitleLabel.topAnchor.constraint(equalTo: songCard.topAnchor, constant: 20),
            songTitleLabel.trailingAnchor.constraint(equalTo: songCard.trailingAnchor, constant: -12),
            
            artistLabel.leadingAnchor.constraint(equalTo: songTitleLabel.leadingAnchor),
            artistLabel.topAnchor.constraint(equalTo: songTitleLabel.bottomAnchor, constant: 4),
            artistLabel.trailingAnchor.constraint(equalTo: songTitleLabel.trailingAnchor),
            
            searchBar.topAnchor.constraint(equalTo: songCard.bottomAnchor, constant: 16),
            searchBar.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            searchBar.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            searchBar.heightAnchor.constraint(equalToConstant: 44),
            
            friendsTableView.topAnchor.constraint(equalTo: searchBar.bottomAnchor, constant: 16),
            friendsTableView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            friendsTableView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            friendsTableView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor),
            friendsTableView.heightAnchor.constraint(equalToConstant: 400),
            
            shareButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            shareButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            shareButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -16),
            shareButton.heightAnchor.constraint(equalToConstant: 56)
        ])
    }
    
    private func loadSharedContent(completion: @escaping (String?) -> Void) {
        writeLogToFile("\(logIdentifier): ====== loadSharedContent CALLED ======")
        print("\(logIdentifier): ====== loadSharedContent CALLED ======")
        os_log("%{public}@: ====== loadSharedContent CALLED ======", log: logger, type: .info, logIdentifier)
        NSLog("\(logIdentifier): ====== loadSharedContent CALLED ======")
        NSLog("\(logIdentifier): loadSharedContent called")
        fputs("\(logIdentifier): loadSharedContent called\n", stderr)
        fflush(stderr)
        
        guard let extensionContext = self.extensionContext else {
            let errorMsg = "\(logIdentifier): ERROR - extensionContext is nil"
            writeLogToFile(errorMsg)
            NSLog(errorMsg)
            print(errorMsg)
            fputs(errorMsg + "\n", stderr)
            fflush(stderr)
            completion(nil)
            return
        }
        
        guard let inputItems = extensionContext.inputItems as? [NSExtensionItem] else {
            let errorMsg = "\(logIdentifier): No input items found"
            NSLog(errorMsg)
            print(errorMsg)
            completion(nil)
            return
        }
        
        let itemsMsg = "\(logIdentifier): Processing \(inputItems.count) input items"
        NSLog(itemsMsg)
        print(itemsMsg)
        
        for item in inputItems {
            guard let attachments = item.attachments else { continue }
            
            for attachment in attachments {
                // Try URL first
                if attachment.hasItemConformingToTypeIdentifier(UTType.url.identifier) {
                    attachment.loadItem(forTypeIdentifier: UTType.url.identifier, options: nil) { (data, error) in
                        if let url = data as? URL {
                            DispatchQueue.main.async { completion(url.absoluteString) }
                        } else if let urlString = data as? String, let url = URL(string: urlString) {
                            DispatchQueue.main.async { completion(url.absoluteString) }
                        } else {
                            DispatchQueue.main.async { completion(nil) }
                        }
                    }
                    return
                }
                
                // Try plain text
                if attachment.hasItemConformingToTypeIdentifier(UTType.plainText.identifier) {
                    attachment.loadItem(forTypeIdentifier: UTType.plainText.identifier, options: nil) { (data, error) in
                        if let text = data as? String, let url = self.extractURL(from: text) {
                            DispatchQueue.main.async { completion(url.absoluteString) }
                        } else {
                            DispatchQueue.main.async { completion(nil) }
                        }
                    }
                    return
                }
            }
        }
        
        completion(nil)
    }
    
    private func extractURL(from text: String) -> URL? {
        let detector = try? NSDataDetector(types: NSTextCheckingResult.CheckingType.link.rawValue)
        let matches = detector?.matches(in: text, options: [], range: NSRange(location: 0, length: text.utf16.count))
        
        if let firstMatch = matches?.first {
            return firstMatch.url
        } else if let directURL = URL(string: text.trimmingCharacters(in: .whitespacesAndNewlines)) {
            return directURL
        }
        return nil
    }
    
    private func fetchMusicMetadata(urlString: String) {
        print("\(logIdentifier): ====== fetchMusicMetadata CALLED ======")
        NSLog("\(logIdentifier): ====== fetchMusicMetadata CALLED ======")
        NSLog("\(logIdentifier): fetchMusicMetadata called with URL: \(urlString)")
        print("\(logIdentifier): fetchMusicMetadata called with URL: \(urlString)")
        fputs("\(logIdentifier): fetchMusicMetadata: \(urlString)\n", stderr)
        
        // Determine service type and extract track ID
        var trackId: String?
        
        if urlString.contains("open.spotify.com/track/") {
            // Spotify URL: extract track ID
            let pattern = #"track/([a-zA-Z0-9]+)"#
            guard let regex = try? NSRegularExpression(pattern: pattern, options: []),
                  let match = regex.firstMatch(in: urlString, options: [], range: NSRange(location: 0, length: urlString.utf16.count)),
                  match.numberOfRanges > 1,
                  let trackIdRange = Range(match.range(at: 1), in: urlString) else {
                NSLog("\(logIdentifier): Could not extract Spotify track ID")
                return
            }
            trackId = String(urlString[trackIdRange])
            self.musicService = "spotify"
            NSLog("\(logIdentifier): Extracted Spotify track ID: \(trackId ?? "nil")")
        } else if urlString.contains("music.apple.com") {
            // Apple Music URL: extract track ID from ?i= parameter
            NSLog("apple_share_debug: Detected Apple Music URL: \(urlString)")
            print("apple_share_debug: Detected Apple Music URL: \(urlString)")
            
            guard let url = URL(string: urlString),
                  let components = URLComponents(url: url, resolvingAgainstBaseURL: false),
                  let queryItems = components.queryItems,
                  let songId = queryItems.first(where: { $0.name == "i" })?.value else {
                NSLog("apple_share_debug: ERROR - Could not extract Apple Music track ID (missing ?i= parameter)")
                print("apple_share_debug: ERROR - Could not extract Apple Music track ID")
                // Show error in UI
                DispatchQueue.main.async {
                    self.songTitleLabel.text = "Apple Music Track"
                    self.artistLabel.text = "Invalid link format"
                }
                return
            }
            trackId = songId
            self.musicService = "apple"
            NSLog("apple_share_debug: Extracted Apple Music track ID: \(trackId ?? "nil")")
            print("apple_share_debug: Extracted Apple Music track ID: \(trackId ?? "nil")")
        } else {
            NSLog("\(logIdentifier): Unsupported URL type - must be Spotify or Apple Music")
            DispatchQueue.main.async {
                self.songTitleLabel.text = "Unsupported Link"
                self.artistLabel.text = "Only Spotify and Apple Music are supported"
            }
            return
        }
        
        guard let extractedTrackId = trackId else {
            NSLog("\(logIdentifier): Could not extract track ID")
            return
        }
        
        self.songTrackId = extractedTrackId
        
        // Call Supabase Edge Function to get metadata
        // Using the process-music-link function which handles Spotify API calls server-side
        let supabaseUrl = "https://uirmafqpkulwkkpyfmrj.supabase.co"
        let functionUrl = "\(supabaseUrl)/functions/v1/process-music-link"
        
        guard let requestUrl = URL(string: functionUrl) else {
            NSLog("\(logIdentifier): Invalid function URL: \(functionUrl)")
            fetchMetadataDirectly(trackId: extractedTrackId, urlString: urlString)
            return
        }
        
        var request = URLRequest(url: requestUrl)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        // Use the anon key for Authorization - format: "Bearer {token}"
        let anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpcm1hZnFwa3Vsd2trcHlmbXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDEwMjMsImV4cCI6MjA4MDM3NzAyM30.OwH5ZtpySBNAXaV4-C1Am1-oLJi42RoXc_3yqgQo-PI"
        request.setValue("Bearer \(anonKey)", forHTTPHeaderField: "Authorization")
        request.setValue(anonKey, forHTTPHeaderField: "apikey")
        
        NSLog("\(logIdentifier): Authorization header set to: Bearer \(anonKey.prefix(20))...")
        
        let requestBody: [String: Any] = ["link": urlString]
        if let bodyData = try? JSONSerialization.data(withJSONObject: requestBody) {
            request.httpBody = bodyData
            NSLog("\(logIdentifier): Request body: \(String(data: bodyData, encoding: .utf8) ?? "nil")")
        } else {
            NSLog("\(logIdentifier): ERROR - Failed to serialize request body")
        }
        
        NSLog("\(logIdentifier): Making request to: \(functionUrl)")
        NSLog("\(logIdentifier): Request URL string: \(urlString)")
        NSLog("\(logIdentifier): Detected service: \(musicService), Track ID: \(extractedTrackId)")
        print("\(logIdentifier): Request URL: \(urlString), Service: \(musicService)")
        
        if musicService == "apple" {
            NSLog("apple_share_debug: Making Edge Function request for Apple Music")
            print("apple_share_debug: Service: apple, Track ID: \(extractedTrackId), URL: \(urlString)")
            NSLog("apple_share_debug: Request URL: \(functionUrl)")
            NSLog("apple_share_debug: Request body will contain link: \(urlString)")
        }
        
        // Configure URLSession with timeout for Share Extension
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 30.0
        config.timeoutIntervalForResource = 30.0
        let session = URLSession(configuration: config)
        
        NSLog("\(logIdentifier): Starting URLSession task...")
        if musicService == "apple" {
            NSLog("apple_share_debug: Starting URLSession task for Apple Music metadata")
        }
        
        let identifier = logIdentifier // Capture before closure
        session.dataTask(with: request) { [weak self] data, response, error in
            guard let self = self else {
                NSLog("\(identifier): ERROR - self is nil in response handler")
                print("apple_share_debug: ERROR - self is nil in response handler")
                return
            }
            
            NSLog("\(logIdentifier): URLSession completion handler called")
            if self.musicService == "apple" {
                NSLog("apple_share_debug: URLSession completion handler called for Apple Music")
                print("apple_share_debug: Response handler executed")
            }
            
            if let error = error {
                NSLog("\(logIdentifier): ERROR - Network error fetching metadata: \(error.localizedDescription)")
                print("\(logIdentifier): ERROR - Network error: \(error)")
                if self.musicService == "apple" {
                    NSLog("apple_share_debug: ERROR - Network error for Apple Music: \(error.localizedDescription)")
                    print("apple_share_debug: ERROR - Network error for Apple Music")
                }
                DispatchQueue.main.async {
                    self.songTitleLabel.text = self.musicService == "apple" ? "Apple Music Track" : "Spotify Track"
                    self.artistLabel.text = "Failed to load details"
                }
                self.fetchMetadataDirectly(trackId: extractedTrackId, urlString: urlString)
                return
            }
            
            guard let httpResponse = response as? HTTPURLResponse else {
                NSLog("\(logIdentifier): ERROR - Invalid response type")
                self.fetchMetadataDirectly(trackId: extractedTrackId, urlString: urlString)
                return
            }
            
            NSLog("\(logIdentifier): Response status code: \(httpResponse.statusCode)")
            print("\(logIdentifier): Response status code: \(httpResponse.statusCode)")
            
            if httpResponse.statusCode != 200 {
                let errorData = data.flatMap { String(data: $0, encoding: .utf8) } ?? "No error data"
                NSLog("\(logIdentifier): ERROR - HTTP \(httpResponse.statusCode): \(errorData)")
                print("\(logIdentifier): ERROR - HTTP \(httpResponse.statusCode): \(errorData)")
                if self.musicService == "apple" {
                    NSLog("apple_share_debug: ERROR - HTTP \(httpResponse.statusCode) for Apple Music: \(errorData)")
                    print("apple_share_debug: ERROR - HTTP \(httpResponse.statusCode) for Apple Music")
                }
                DispatchQueue.main.async {
                    self.songTitleLabel.text = self.musicService == "apple" ? "Apple Music Track" : "Spotify Track"
                    self.artistLabel.text = "Failed to load (HTTP \(httpResponse.statusCode))"
                }
                self.fetchMetadataDirectly(trackId: extractedTrackId, urlString: urlString)
                return
            }
            
            guard let data = data else {
                NSLog("\(logIdentifier): ERROR - No data in response")
                self.fetchMetadataDirectly(trackId: extractedTrackId, urlString: urlString)
                return
            }
            
            let responseString = String(data: data, encoding: .utf8) ?? "nil"
            NSLog("\(logIdentifier): Response data (first 500 chars): \(String(responseString.prefix(500)))")
            print("\(logIdentifier): Response data: \(responseString)")
            
            if self.musicService == "apple" {
                NSLog("apple_share_debug: Edge Function response for Apple Music (first 500 chars): \(String(responseString.prefix(500)))")
                print("apple_share_debug: Full response: \(responseString)")
            }
            
            guard let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
                NSLog("\(logIdentifier): ERROR - Failed to parse JSON. Response was: \(responseString)")
                print("\(logIdentifier): ERROR - Failed to parse JSON")
                if self.musicService == "apple" {
                    NSLog("apple_share_debug: ERROR - Failed to parse JSON for Apple Music. Response: \(responseString)")
                    print("apple_share_debug: ERROR - Failed to parse JSON for Apple Music")
                }
                self.fetchMetadataDirectly(trackId: extractedTrackId, urlString: urlString)
                return
            }
            
            NSLog("\(logIdentifier): Parsed JSON keys: \(json.keys.joined(separator: ", "))")
            print("\(logIdentifier): Parsed JSON: \(json)")
            
            if self.musicService == "apple" {
                NSLog("apple_share_debug: Parsed JSON keys for Apple Music: \(json.keys.joined(separator: ", "))")
                print("apple_share_debug: Parsed JSON: \(json)")
            }
            
            // Check for error in response
            if let errorMessage = json["error"] as? String {
                NSLog("\(logIdentifier): ERROR - Edge Function returned error: \(errorMessage)")
                print("\(logIdentifier): ERROR - Edge Function error: \(errorMessage)")
                if self.musicService == "apple" {
                    NSLog("apple_share_debug: ERROR - Edge Function error for Apple Music: \(errorMessage)")
                    print("apple_share_debug: ERROR - Edge Function error: \(errorMessage)")
                }
                DispatchQueue.main.async {
                    self.songTitleLabel.text = self.musicService == "apple" ? "Apple Music Track" : "Spotify Track"
                    self.artistLabel.text = "Error: \(errorMessage)"
                }
                self.fetchMetadataDirectly(trackId: extractedTrackId, urlString: urlString)
                return
            }
            
            guard let title = json["title"] as? String,
                  let artist = json["artist"] as? String else {
                NSLog("\(logIdentifier): ERROR - Missing title or artist in response. JSON keys: \(json.keys.joined(separator: ", "))")
                print("\(logIdentifier): ERROR - Missing title or artist. Full JSON: \(json)")
                if self.musicService == "apple" {
                    NSLog("apple_share_debug: ERROR - Missing title or artist for Apple Music. Keys: \(json.keys.joined(separator: ", "))")
                    print("apple_share_debug: ERROR - Missing title or artist. Full JSON: \(json)")
                }
                DispatchQueue.main.async {
                    self.songTitleLabel.text = self.musicService == "apple" ? "Apple Music Track" : "Spotify Track"
                    self.artistLabel.text = "Missing metadata"
                }
                self.fetchMetadataDirectly(trackId: extractedTrackId, urlString: urlString)
                return
            }
            
            let artworkURL = json["artworkURL"] as? String
            
            NSLog("\(logIdentifier): ✅ SUCCESS - Fetched metadata - Title: \(title), Artist: \(artist), Artwork: \(artworkURL ?? "nil"), Service: \(self.musicService)")
            print("\(logIdentifier): ✅ SUCCESS - Title: \(title), Artist: \(artist)")
            
            if self.musicService == "apple" {
                NSLog("apple_share_debug: ✅ SUCCESS - Apple Music metadata - Title: \(title), Artist: \(artist), Artwork: \(artworkURL ?? "nil")")
                print("apple_share_debug: ✅ SUCCESS - Title: \(title), Artist: \(artist)")
            }
            
            DispatchQueue.main.async {
                self.songTitle = title
                self.songArtist = artist
                self.songArtwork = artworkURL
                self.updateSongUI(title: title, artist: artist, artworkURL: artworkURL)
            }
        }.resume()
    }
    
    private func fetchMetadataDirectly(trackId: String, urlString: String) {
        NSLog("\(logIdentifier): Trying fallback for track: \(trackId), service: \(musicService)")
        
        if musicService == "apple" {
            NSLog("apple_share_debug: Using fallback for Apple Music - track ID: \(trackId)")
            print("apple_share_debug: Fallback mode for Apple Music")
        }
        
        // Fallback: Show basic info extracted from URL
        DispatchQueue.main.async {
            if self.musicService == "apple" {
                NSLog("apple_share_debug: Showing fallback UI for Apple Music")
                self.songTitleLabel.text = "Apple Music Track"
                self.artistLabel.text = urlString.contains("music.apple.com") ? "Loading details..." : "Share this song"
            } else {
                self.songTitleLabel.text = "Spotify Track"
                self.artistLabel.text = urlString.contains("track/") ? "Loading details..." : "Share this song"
            }
            
            NSLog("\(self.logIdentifier): Showing fallback UI - track ID: \(trackId), service: \(self.musicService)")
            
            // Even without metadata, we can still allow sharing
            // The UI is already visible, user can select friends and share
        }
    }
    
    private func updateSongUI(title: String, artist: String, artworkURL: String?) {
        NSLog("\(logIdentifier): Updating UI with title: \(title), artist: \(artist)")
        
        songTitleLabel.text = title
        artistLabel.text = artist
        
        // Load album art
        if let artworkURL = artworkURL, let imageUrl = URL(string: artworkURL) {
            loadAlbumArt(from: imageUrl)
        }
    }
    
    private func loadAlbumArt(from url: URL) {
        NSLog("\(logIdentifier): Loading album art from: \(url.absoluteString)")
        
        let identifier = logIdentifier // Capture identifier before closure
        URLSession.shared.dataTask(with: url) { [weak self] data, response, error in
            guard let self = self,
                  let data = data,
                  let image = UIImage(data: data) else {
                NSLog("\(identifier): Failed to load album art")
                return
            }
            
            DispatchQueue.main.async {
                self.albumArtImageView.image = image
                NSLog("\(identifier): Album art loaded successfully")
            }
        }.resume()
    }
    
    @objc private func shareButtonTapped() {
        guard let urlString = sharedURL, !selectedFriendIds.isEmpty else {
            NSLog("\(logIdentifier): ERROR - Cannot share: no URL or no friends selected")
            return
        }
        
        NSLog("\(logIdentifier): Share button tapped with URL: \(urlString)")
        NSLog("\(logIdentifier): Selected friends: \(selectedFriendIds)")
        NSLog("\(logIdentifier): Song metadata - Title: \(songTitle ?? "nil"), Artist: \(songArtist ?? "nil")")
        
        // Create shared songs and activities in database, then dismiss
        createShareRecords(urlString: urlString) { [weak self] in
            guard let self = self else { return }
            // Clear any pending shared URL so the main app doesn't prompt again
            self.clearSharedMusicURL()
            // Process share and dismiss only after requests finish
            self.processShare(urlString: urlString)
        }
    }
    
    private func createShareRecords(urlString: String, completion: @escaping () -> Void) {
        let debugId = "share_with_platnm_friends"
        NSLog("\(debugId): ====== createShareRecords CALLED ======")
        
        guard let appGroupId = UserDefaults(suiteName: "group.com.platnm.5a1fixcuqweopqweopqwieopwqieopqwieoiqwopieopqiwopeiqwpoeioqwiepoqiwjdnaskncklnsdlfnlkas9635.app"),
              let sessionDataString = appGroupId.string(forKey: "sessionData"),
              let sessionDataData = sessionDataString.data(using: .utf8),
              let sessionJson = try? JSONSerialization.jsonObject(with: sessionDataData) as? [String: Any],
              let accessToken = sessionJson["access_token"] as? String,
              let senderId = sessionJson["user_id"] as? String else {
            NSLog("\(debugId): ERROR - Could not get session data for sharing")
            completion()
            return
        }
        
        let supabaseUrl = "https://uirmafqpkulwkkpyfmrj.supabase.co"
        let anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpcm1hZnFwa3Vsd2trcHlmbXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDEwMjMsImV4cCI6MjA4MDM3NzAyM30.OwH5ZtpySBNAXaV4-C1Am1-oLJi42RoXc_3yqgQo-PI"
        
        // Extract track ID if we don't have it
        let trackId = songTrackId ?? extractTrackId(from: urlString)
        let title = songTitle ?? "Unknown Song"
        let artist = songArtist ?? "Unknown Artist"
        let artwork = songArtwork ?? ""
        let service = musicService // Use the detected service type
        
        NSLog("\(debugId): Creating share records - Track: \(trackId), Title: \(title), Artist: \(artist), Service: \(service)")
        NSLog("\(debugId): Creating shared_songs for \(selectedFriendIds.count) friends")
        
        if service == "apple" {
            NSLog("apple_share_debug: Creating Apple Music share records - Track: \(trackId), Title: \(title), Artist: \(artist)")
            print("apple_share_debug: Creating share records for \(selectedFriendIds.count) friends")
        }
        
        // Create shared_songs records for each friend
        let sharedSongs = selectedFriendIds.map { friendId in
            let record: [String: Any] = [
                "sender_id": senderId,
                "receiver_id": friendId,
                "song_id": trackId,
                "song_title": title,
                "song_artist": artist,
                "song_artwork": artwork,
                "service": service, // Use detected service (spotify or apple)
                "external_url": urlString,
                "is_queued": false,  // Not queued when sharing to a friend
                "liked": NSNull()    // Explicitly set to NULL (unreacted) so it appears in inbox
            ]
            NSLog("\(debugId): Creating shared_song record for friend \(friendId) with service: \(service), is_queued: false, liked: NULL")
            if service == "apple" {
                NSLog("apple_share_debug: Creating Apple Music shared_song for friend \(friendId)")
            }
            return record
        }
        
        let sharedSongsUrl = "\(supabaseUrl)/rest/v1/shared_songs"
        guard let sharedSongsRequestUrl = URL(string: sharedSongsUrl) else {
            NSLog("\(debugId): ERROR - Invalid shared_songs URL")
            completion()
            return
        }
        
        var sharedSongsRequest = URLRequest(url: sharedSongsRequestUrl)
        sharedSongsRequest.httpMethod = "POST"
        sharedSongsRequest.setValue(anonKey, forHTTPHeaderField: "apikey")
        sharedSongsRequest.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        sharedSongsRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        sharedSongsRequest.setValue("return=representation", forHTTPHeaderField: "Prefer")  // Return created records for verification
        
        do {
            sharedSongsRequest.httpBody = try JSONSerialization.data(withJSONObject: sharedSongs)
        } catch {
            NSLog("\(debugId): ERROR - Failed to serialize shared_songs: \(error)")
            completion()
            return
        }
        
        URLSession.shared.dataTask(with: sharedSongsRequest) { [weak self] data, response, error in
            guard let self = self else { return }
            if let error = error {
                NSLog("\(debugId): ERROR - Failed to create shared_songs: \(error.localizedDescription)")
                completion()
                return
            }
            
            if let httpResponse = response as? HTTPURLResponse {
                NSLog("\(debugId): shared_songs API response status: \(httpResponse.statusCode)")
                
                if httpResponse.statusCode == 201 || httpResponse.statusCode == 204 {
                    // Parse response to verify created records
                    if let data = data,
                       let json = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]],
                       !json.isEmpty {
                        let createdRecord = json[0]
                        NSLog("\(debugId): SUCCESS - Created shared_songs record with id: \(createdRecord["id"] ?? "unknown"), is_queued: \(createdRecord["is_queued"] ?? "unknown"), liked: \(createdRecord["liked"] ?? "unknown")")
                    } else {
                        NSLog("\(debugId): SUCCESS - Created shared_songs records (no response data)")
                    }
                    // Now create activities
                    self.createActivities(
                        senderId: senderId,
                        title: title,
                        artist: artist,
                        artwork: artwork,
                        accessToken: accessToken,
                        anonKey: anonKey,
                        supabaseUrl: supabaseUrl,
                        debugId: debugId,
                        completion: completion
                    )
                } else {
                    if let data = data, let errorString = String(data: data, encoding: .utf8) {
                        NSLog("\(debugId): ERROR - shared_songs response (status \(httpResponse.statusCode)): \(errorString)")
                    } else {
                        NSLog("\(debugId): ERROR - shared_songs request failed with status \(httpResponse.statusCode) and no error message")
                    }
                    completion()
                }
            }
        }.resume()
    }
    
    private func createActivities(senderId: String, title: String, artist: String, artwork: String, accessToken: String, anonKey: String, supabaseUrl: String, debugId: String, completion: @escaping () -> Void) {
        NSLog("\(debugId): ====== createActivities CALLED ======")
        NSLog("\(debugId): Creating activities for \(selectedFriendIds.count) friends")
        
        // Create activity records for each friend
        // Use 'song_sent' to match database CHECK constraint (allows: 'friend_request', 'friend_accepted', 'song_liked', 'song_disliked', 'song_sent')
        // ActivityService handles both 'song_sent' and 'song_shared' for backwards compatibility
        let activities = selectedFriendIds.map { friendId in
            let activity: [String: Any] = [
                "user_id": friendId, // Friend receives the activity
                "type": "song_sent", // Use 'song_sent' to match CHECK constraint
                "actor_id": senderId, // Current user is the actor
                "song_title": title,
                "song_artist": artist,
                "song_artwork": artwork,
                "is_actionable": false,
                "is_completed": false
            ]
            NSLog("\(debugId): Creating activity for friend \(friendId) with type: song_sent")
            return activity
        }
        
        let activitiesUrl = "\(supabaseUrl)/rest/v1/activities"
        guard let activitiesRequestUrl = URL(string: activitiesUrl) else {
            NSLog("\(debugId): ERROR - Invalid activities URL")
            completion()
            return
        }
        
        var activitiesRequest = URLRequest(url: activitiesRequestUrl)
        activitiesRequest.httpMethod = "POST"
        activitiesRequest.setValue(anonKey, forHTTPHeaderField: "apikey")
        activitiesRequest.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        activitiesRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        activitiesRequest.setValue("return=representation", forHTTPHeaderField: "Prefer")  // Return created records for verification
        
        do {
            let jsonData = try JSONSerialization.data(withJSONObject: activities)
            NSLog("\(debugId): Serialized \(activities.count) activities, payload size: \(jsonData.count) bytes")
            activitiesRequest.httpBody = jsonData
        } catch {
            NSLog("\(debugId): ERROR - Failed to serialize activities: \(error)")
            completion()
            return
        }
        
        URLSession.shared.dataTask(with: activitiesRequest) { data, response, error in
            if let error = error {
                NSLog("\(debugId): ERROR - Failed to create activities: \(error.localizedDescription)")
                completion()
                return
            }
            
            if let httpResponse = response as? HTTPURLResponse {
                NSLog("\(debugId): activities API response status: \(httpResponse.statusCode)")
                
                if httpResponse.statusCode == 201 || httpResponse.statusCode == 204 {
                    // Parse response to verify created records
                    if let data = data,
                       let json = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]],
                       !json.isEmpty {
                        NSLog("\(debugId): SUCCESS - Created \(json.count) activity records")
                        for (index, activity) in json.enumerated() {
                            NSLog("\(debugId): Activity \(index + 1): id=\(activity["id"] ?? "unknown"), type=\(activity["type"] ?? "unknown"), user_id=\(activity["user_id"] ?? "unknown"), actor_id=\(activity["actor_id"] ?? "unknown")")
                        }
                    } else {
                        NSLog("\(debugId): SUCCESS - Created activity records (no response data)")
                    }
                    completion()
                } else {
                    if let data = data, let errorString = String(data: data, encoding: .utf8) {
                        NSLog("\(debugId): ERROR - activities response (status \(httpResponse.statusCode)): \(errorString)")
                    } else {
                        NSLog("\(debugId): ERROR - activities request failed with status \(httpResponse.statusCode) and no error message")
                    }
                    completion()
                }
            }
        }.resume()
    }
    
    private func extractTrackId(from urlString: String) -> String {
        // Try Spotify pattern first
        if urlString.contains("open.spotify.com/track/") {
            let pattern = #"track/([a-zA-Z0-9]+)"#
            guard let regex = try? NSRegularExpression(pattern: pattern, options: []),
                  let match = regex.firstMatch(in: urlString, options: [], range: NSRange(location: 0, length: urlString.utf16.count)),
                  match.numberOfRanges > 1,
                  let trackIdRange = Range(match.range(at: 1), in: urlString) else {
                return urlString // Fallback to full URL if can't extract
            }
            return String(urlString[trackIdRange])
        }
        
        // Try Apple Music pattern
        if urlString.contains("music.apple.com") {
            guard let url = URL(string: urlString),
                  let components = URLComponents(url: url, resolvingAgainstBaseURL: false),
                  let queryItems = components.queryItems,
                  let songId = queryItems.first(where: { $0.name == "i" })?.value else {
                return urlString // Fallback to full URL if can't extract
            }
            return songId
        }
        
        // Fallback to full URL if neither pattern matches
        return urlString
    }
    
    private func storeInAppGroup(urlString: String) {
        let appGroupId = "group.com.platnm.5a1fixcuqweopqweopqwieopwqieopqwieoiqwopieopqiwopeiqwpoeioqwiepoqiwjdnaskncklnsdlfnlkas9635.app"
        
        if let sharedDefaults = UserDefaults(suiteName: appGroupId) {
            sharedDefaults.set(urlString, forKey: "sharedMusicURL")
            sharedDefaults.synchronize()
            NSLog("\(logIdentifier): Stored URL in App Group: \(urlString)")
        }
    }

    private func clearSharedMusicURL() {
        let appGroupId = "group.com.platnm.5a1fixcuqweopqweopqwieopwqieopqwieoiqwopieopqiwopeiqwpoeioqwiepoqiwjdnaskncklnsdlfnlkas9635.app"
        
        if let sharedDefaults = UserDefaults(suiteName: appGroupId) {
            sharedDefaults.removeObject(forKey: "sharedMusicURL")
            sharedDefaults.synchronize()
            NSLog("\(logIdentifier): Cleared sharedMusicURL from App Group after sharing")
        }
    }
    
    private func processShare(urlString: String) {
        NSLog("\(logIdentifier): processShare called with URL: \(urlString)")
        
        guard let extensionContext = self.extensionContext else { return }
        
        let identifier = logIdentifier // Capture identifier before closure
        extensionContext.completeRequest(returningItems: [], completionHandler: { (expired) in
            NSLog("\(identifier): Extension completed - returning to music app")
        })
    }
    
    private func loadFriends() {
        let debugId = "share_with_platnm_friends"
        NSLog("\(debugId): ====== loadFriends CALLED ======")
        writeLogToFile("\(debugId): ====== loadFriends CALLED ======")
        
        // Get user ID from App Group session data
        let appGroupId = "group.com.platnm.5a1fixcuqweopqweopqwieopwqieopqwieoiqwopieopqiwopeiqwpoeioqwiepoqiwjdnaskncklnsdlfnlkas9635.app"
        NSLog("\(debugId): Attempting to access App Group: \(appGroupId)")
        writeLogToFile("\(debugId): Attempting to access App Group: \(appGroupId)")
        
        guard let sharedDefaults = UserDefaults(suiteName: appGroupId) else {
            NSLog("\(debugId): ERROR - Could not access App Group UserDefaults")
            writeLogToFile("\(debugId): ERROR - Could not access App Group UserDefaults")
            return
        }
        
        NSLog("\(debugId): Successfully accessed App Group UserDefaults")
        writeLogToFile("\(debugId): Successfully accessed App Group UserDefaults")
        
        guard let sessionDataString = sharedDefaults.string(forKey: "sessionData") else {
            NSLog("\(debugId): ERROR - No sessionData found in App Group")
            writeLogToFile("\(debugId): ERROR - No sessionData found in App Group")
            // Log all keys for debugging
            let allKeys = sharedDefaults.dictionaryRepresentation().keys
            NSLog("\(debugId): Available keys in App Group: \(Array(allKeys))")
            writeLogToFile("\(debugId): Available keys in App Group: \(Array(allKeys))")
            return
        }
        
        NSLog("\(debugId): Found sessionData string (length: \(sessionDataString.count))")
        writeLogToFile("\(debugId): Found sessionData string (length: \(sessionDataString.count))")
        
        guard let sessionData = sessionDataString.data(using: .utf8) else {
            NSLog("\(debugId): ERROR - Could not convert sessionData string to Data")
            writeLogToFile("\(debugId): ERROR - Could not convert sessionData string to Data")
            return
        }
        
        guard let sessionJson = try? JSONSerialization.jsonObject(with: sessionData) as? [String: Any] else {
            NSLog("\(debugId): ERROR - Could not parse sessionData as JSON")
            writeLogToFile("\(debugId): ERROR - Could not parse sessionData as JSON")
            return
        }
        
        NSLog("\(debugId): Successfully parsed sessionData JSON")
        writeLogToFile("\(debugId): Successfully parsed sessionData JSON")
        NSLog("\(debugId): Session JSON keys: \(Array(sessionJson.keys))")
        writeLogToFile("\(debugId): Session JSON keys: \(Array(sessionJson.keys))")
        
        guard let userId = sessionJson["user_id"] as? String else {
            NSLog("\(debugId): ERROR - Could not extract user_id from session JSON")
            writeLogToFile("\(debugId): ERROR - Could not extract user_id from session JSON")
            NSLog("\(debugId): Session JSON contents: \(sessionJson)")
            writeLogToFile("\(debugId): Session JSON contents: \(sessionJson)")
            return
        }
        
        NSLog("\(debugId): SUCCESS - Got user ID: \(userId)")
        writeLogToFile("\(debugId): SUCCESS - Got user ID: \(userId)")
        
        // Supabase configuration
        let supabaseUrl = "https://uirmafqpkulwkkpyfmrj.supabase.co"
        let anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpcm1hZnFwa3Vsd2trcHlmbXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDEwMjMsImV4cCI6MjA4MDM3NzAyM30.OwH5ZtpySBNAXaV4-C1Am1-oLJi42RoXc_3yqgQo-PI"
        
        NSLog("\(debugId): Starting to fetch friendships for user: \(userId)")
        writeLogToFile("\(debugId): Starting to fetch friendships for user: \(userId)")
        
        // First, get friendships - use URL encoding for the or operator
        // PostgREST format: or=(condition1,condition2) needs to be URL encoded
        let orCondition = "or=(user_id.eq.\(userId),friend_id.eq.\(userId))"
        let encodedOrCondition = orCondition.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? orCondition
        let friendshipsUrl = "\(supabaseUrl)/rest/v1/friendships?status=eq.accepted&\(encodedOrCondition)&select=user_id,friend_id"
        
        NSLog("\(debugId): Friendships URL: \(friendshipsUrl)")
        writeLogToFile("\(debugId): Friendships URL: \(friendshipsUrl)")
        
        guard let url = URL(string: friendshipsUrl) else {
            NSLog("\(debugId): ERROR - Invalid friendships URL")
            writeLogToFile("\(debugId): ERROR - Invalid friendships URL")
            return
        }
        
        // Get access token from session data for authenticated requests
        guard let sessionDataString = sharedDefaults.string(forKey: "sessionData"),
              let sessionDataData = sessionDataString.data(using: .utf8),
              let sessionJson = try? JSONSerialization.jsonObject(with: sessionDataData) as? [String: Any],
              let accessToken = sessionJson["access_token"] as? String else {
            NSLog("\(debugId): ERROR - Could not get access_token from session data")
            writeLogToFile("\(debugId): ERROR - Could not get access_token from session data")
            return
        }
        
        // Use anon key for apikey (already declared above), but user's access token for Authorization
        var request = URLRequest(url: url)
        request.setValue(anonKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        NSLog("\(debugId): Using access token for friendships request (first 20 chars: \(accessToken.prefix(20)))")
        writeLogToFile("\(debugId): Using access token for friendships request (first 20 chars: \(accessToken.prefix(20)))")
        
        NSLog("\(debugId): Making friendships API request...")
        writeLogToFile("\(debugId): Making friendships API request...")
        
        URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
            guard let self = self else {
                NSLog("\(debugId): ERROR - self is nil in friendships response handler")
                return
            }
            
            if let error = error {
                NSLog("\(debugId): ERROR - Error fetching friendships: \(error.localizedDescription)")
                self.writeLogToFile("\(debugId): ERROR - Error fetching friendships: \(error.localizedDescription)")
                return
            }
            
            if let httpResponse = response as? HTTPURLResponse {
                NSLog("\(debugId): Friendships API response status: \(httpResponse.statusCode)")
                self.writeLogToFile("\(debugId): Friendships API response status: \(httpResponse.statusCode)")
                
                if httpResponse.statusCode != 200 {
                    if let data = data, let errorString = String(data: data, encoding: .utf8) {
                        NSLog("\(debugId): ERROR - Non-200 response: \(errorString)")
                        self.writeLogToFile("\(debugId): ERROR - Non-200 response: \(errorString)")
                    }
                    return
                }
            }
            
            guard let data = data else {
                NSLog("\(debugId): ERROR - No data in friendships response")
                self.writeLogToFile("\(debugId): ERROR - No data in friendships response")
                return
            }
            
            NSLog("\(debugId): Received friendships data (length: \(data.count) bytes)")
            self.writeLogToFile("\(debugId): Received friendships data (length: \(data.count) bytes)")
            
            if let dataString = String(data: data, encoding: .utf8) {
                NSLog("\(debugId): Friendships response: \(dataString)")
                self.writeLogToFile("\(debugId): Friendships response: \(dataString)")
            }
            
            guard let friendships = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]] else {
                NSLog("\(debugId): ERROR - Failed to parse friendships JSON")
                self.writeLogToFile("\(debugId): ERROR - Failed to parse friendships JSON")
                return
            }
            
            NSLog("\(debugId): SUCCESS - Parsed \(friendships.count) friendships")
            self.writeLogToFile("\(debugId): SUCCESS - Parsed \(friendships.count) friendships")
            
            // Extract friend IDs
            var friendIds: [String] = []
            for friendship in friendships {
                if let friendId = friendship["user_id"] as? String, friendId != userId {
                    friendIds.append(friendId)
                    NSLog("\(debugId): Found friend via user_id: \(friendId)")
                    self.writeLogToFile("\(debugId): Found friend via user_id: \(friendId)")
                } else if let friendId = friendship["friend_id"] as? String, friendId != userId {
                    friendIds.append(friendId)
                    NSLog("\(debugId): Found friend via friend_id: \(friendId)")
                    self.writeLogToFile("\(debugId): Found friend via friend_id: \(friendId)")
                }
            }
            
            NSLog("\(debugId): Extracted \(friendIds.count) friend IDs: \(friendIds)")
            self.writeLogToFile("\(debugId): Extracted \(friendIds.count) friend IDs: \(friendIds)")
            
            if friendIds.isEmpty {
                NSLog("\(debugId): No friends found, reloading empty table")
                self.writeLogToFile("\(debugId): No friends found, reloading empty table")
                DispatchQueue.main.async {
                    self.friendsTableView.reloadData()
                }
                return
            }
            
            NSLog("\(debugId): Found \(friendIds.count) friends, fetching profiles...")
            self.writeLogToFile("\(debugId): Found \(friendIds.count) friends, fetching profiles...")
            
            // Fetch friend profiles using PostgREST IN operator
            // Format: id=in.(uuid1,uuid2,uuid3)
            let friendIdsJoined = friendIds.joined(separator: ",")
            let inCondition = "id=in.(\(friendIdsJoined))"
            let profilesUrl = "\(supabaseUrl)/rest/v1/profiles?\(inCondition)&select=id,first_name,last_name,username,avatar_url"
            
            NSLog("\(debugId): Profiles URL: \(profilesUrl)")
            self.writeLogToFile("\(debugId): Profiles URL: \(profilesUrl)")
            
            guard let profilesURL = URL(string: profilesUrl) else {
                NSLog("\(debugId): ERROR - Invalid profiles URL")
                self.writeLogToFile("\(debugId): ERROR - Invalid profiles URL")
                return
            }
            
            // Get access token from session data for authenticated requests
            guard let sessionDataString = sharedDefaults.string(forKey: "sessionData"),
                  let sessionDataData = sessionDataString.data(using: .utf8),
                  let sessionJson = try? JSONSerialization.jsonObject(with: sessionDataData) as? [String: Any],
                  let accessToken = sessionJson["access_token"] as? String else {
                NSLog("\(debugId): ERROR - Could not get access_token from session data for profiles request")
                self.writeLogToFile("\(debugId): ERROR - Could not get access_token from session data for profiles request")
                return
            }
            
            var profilesRequest = URLRequest(url: profilesURL)
            profilesRequest.setValue(anonKey, forHTTPHeaderField: "apikey")
            profilesRequest.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
            profilesRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
            
            NSLog("\(debugId): Making profiles API request...")
            self.writeLogToFile("\(debugId): Making profiles API request...")
            
            URLSession.shared.dataTask(with: profilesRequest) { [weak self] data, response, error in
                guard let self = self else {
                    NSLog("\(debugId): ERROR - self is nil in profiles response handler")
                    return
                }
                
                if let error = error {
                    NSLog("\(debugId): ERROR - Error fetching profiles: \(error.localizedDescription)")
                    self.writeLogToFile("\(debugId): ERROR - Error fetching profiles: \(error.localizedDescription)")
                    return
                }
                
                if let httpResponse = response as? HTTPURLResponse {
                    NSLog("\(debugId): Profiles API response status: \(httpResponse.statusCode)")
                    self.writeLogToFile("\(debugId): Profiles API response status: \(httpResponse.statusCode)")
                    
                    if httpResponse.statusCode != 200 {
                        if let data = data, let errorString = String(data: data, encoding: .utf8) {
                            NSLog("\(debugId): ERROR - Non-200 response: \(errorString)")
                            self.writeLogToFile("\(debugId): ERROR - Non-200 response: \(errorString)")
                        }
                        return
                    }
                }
                
                guard let data = data else {
                    NSLog("\(debugId): ERROR - No data in profiles response")
                    self.writeLogToFile("\(debugId): ERROR - No data in profiles response")
                    return
                }
                
                NSLog("\(debugId): Received profiles data (length: \(data.count) bytes)")
                self.writeLogToFile("\(debugId): Received profiles data (length: \(data.count) bytes)")
                
                if let dataString = String(data: data, encoding: .utf8) {
                    NSLog("\(debugId): Profiles response: \(dataString.prefix(500))") // Log first 500 chars
                    self.writeLogToFile("\(debugId): Profiles response: \(dataString)")
                }
                
                guard let profiles = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]] else {
                    NSLog("\(debugId): ERROR - Failed to parse profiles JSON")
                    self.writeLogToFile("\(debugId): ERROR - Failed to parse profiles JSON")
                    return
                }
                
                NSLog("\(debugId): SUCCESS - Parsed \(profiles.count) friend profiles")
                self.writeLogToFile("\(debugId): SUCCESS - Parsed \(profiles.count) friend profiles")
                
                // Convert to FriendData
                var friendList: [FriendData] = []
                NSLog("\(debugId): Converting \(profiles.count) profiles to FriendData...")
                self.writeLogToFile("\(debugId): Converting \(profiles.count) profiles to FriendData...")
                
                for (index, profile) in profiles.enumerated() {
                    guard let id = profile["id"] as? String else {
                        NSLog("\(debugId): WARNING - Profile at index \(index) missing id")
                        self.writeLogToFile("\(debugId): WARNING - Profile at index \(index) missing id")
                        continue
                    }
                    
                    let firstName = profile["first_name"] as? String ?? ""
                    let lastName = profile["last_name"] as? String ?? ""
                    let username = profile["username"] as? String ?? ""
                    let avatarUrl = profile["avatar_url"] as? String
                    
                    // Create display name
                    let name: String
                    if !firstName.isEmpty && !lastName.isEmpty {
                        name = "\(firstName) \(lastName)"
                    } else if !firstName.isEmpty {
                        name = firstName
                    } else if !username.isEmpty {
                        name = username
                    } else {
                        name = "User"
                    }
                    
                    // Create handle (username or empty)
                    let handle = username.isEmpty ? "" : "@\(username)"
                    
                    let friendData = FriendData(id: id, name: name, handle: handle, avatarUrl: avatarUrl)
                    friendList.append(friendData)
                    
                    NSLog("\(debugId): Added friend #\(index + 1): \(name) (\(handle)) - ID: \(id)")
                    self.writeLogToFile("\(debugId): Added friend #\(index + 1): \(name) (\(handle)) - ID: \(id)")
                }
                
                NSLog("\(debugId): Converted \(friendList.count) profiles to FriendData")
                self.writeLogToFile("\(debugId): Converted \(friendList.count) profiles to FriendData")
                
                DispatchQueue.main.async {
                    self.friends = friendList
                    NSLog("\(debugId): Updated friends array with \(friendList.count) friends on main thread")
                    self.writeLogToFile("\(debugId): Updated friends array with \(friendList.count) friends on main thread")
                    
                    self.friendsTableView.reloadData()
                    NSLog("\(debugId): SUCCESS - Reloaded table view with \(friendList.count) friends")
                    self.writeLogToFile("\(debugId): SUCCESS - Reloaded table view with \(friendList.count) friends")
                }
            }.resume()
        }.resume()
    }
    
    private func dismissExtension() {
        writeLogToFile("\(logIdentifier): dismissExtension called")
        print("\(logIdentifier): dismissExtension called")
        
        guard let extensionContext = self.extensionContext else {
            writeLogToFile("\(logIdentifier): ERROR - extensionContext is nil in dismissExtension")
            return
        }
        extensionContext.cancelRequest(withError: NSError(domain: "com.platnm.shareextension", code: 0, userInfo: nil))
        writeLogToFile("\(logIdentifier): Extension cancellation requested")
    }
    
    // Override to ensure we have access to extensionContext
    override var extensionContext: NSExtensionContext? {
        get {
            return super.extensionContext
        }
    }
}

// MARK: - UITableViewDataSource & Delegate
extension ShareViewController: UITableViewDataSource, UITableViewDelegate {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return friends.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "FriendCell", for: indexPath) as! FriendTableViewCell
        let friend = friends[indexPath.row]
        cell.configure(with: friend, isSelected: selectedFriendIds.contains(friend.id))
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        let friend = friends[indexPath.row]
        
        if selectedFriendIds.contains(friend.id) {
            selectedFriendIds.remove(friend.id)
        } else {
            selectedFriendIds.insert(friend.id)
        }
        
        tableView.reloadRows(at: [indexPath], with: .none)
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 72
    }
}

// MARK: - Friend Cell
class FriendTableViewCell: UITableViewCell {
    private var avatarView: UIView!
    private var nameLabel: UILabel!
    private var handleLabel: UILabel!
    private var selectionIndicator: UIView!
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setupUI() {
        backgroundColor = UIColor(red: 0.055, green: 0.055, blue: 0.055, alpha: 1.0)
        selectionStyle = .none
        
        // Avatar
        avatarView = UIView()
        avatarView.backgroundColor = UIColor(red: 0.22, green: 0.25, blue: 0.29, alpha: 1.0)
        avatarView.layer.cornerRadius = 20
        avatarView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(avatarView)
        
        // Name
        nameLabel = UILabel()
        nameLabel.textColor = .white
        nameLabel.font = UIFont.systemFont(ofSize: 16)
        nameLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(nameLabel)
        
        // Handle
        handleLabel = UILabel()
        handleLabel.textColor = .gray
        handleLabel.font = UIFont.systemFont(ofSize: 14)
        handleLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(handleLabel)
        
        // Selection Indicator
        selectionIndicator = UIView()
        selectionIndicator.backgroundColor = .clear
        selectionIndicator.layer.borderWidth = 2
        selectionIndicator.layer.borderColor = UIColor.white.cgColor
        selectionIndicator.layer.cornerRadius = 12
        selectionIndicator.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(selectionIndicator)
        
        NSLayoutConstraint.activate([
            avatarView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            avatarView.centerYAnchor.constraint(equalTo: contentView.centerYAnchor),
            avatarView.widthAnchor.constraint(equalToConstant: 40),
            avatarView.heightAnchor.constraint(equalToConstant: 40),
            
            nameLabel.leadingAnchor.constraint(equalTo: avatarView.trailingAnchor, constant: 12),
            nameLabel.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 18),
            nameLabel.trailingAnchor.constraint(lessThanOrEqualTo: selectionIndicator.leadingAnchor, constant: -8),
            
            handleLabel.leadingAnchor.constraint(equalTo: nameLabel.leadingAnchor),
            handleLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 4),
            handleLabel.trailingAnchor.constraint(equalTo: nameLabel.trailingAnchor),
            
            selectionIndicator.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            selectionIndicator.centerYAnchor.constraint(equalTo: contentView.centerYAnchor),
            selectionIndicator.widthAnchor.constraint(equalToConstant: 24),
            selectionIndicator.heightAnchor.constraint(equalToConstant: 24)
        ])
    }
    
    func configure(with friend: ShareViewController.FriendData, isSelected: Bool) {
        nameLabel.text = friend.name
        handleLabel.text = friend.handle
        
        // TODO: Load avatar image from friend.avatarUrl
        
        // Update selection state
        selectionIndicator.layer.borderWidth = isSelected ? 0 : 2
        selectionIndicator.backgroundColor = isSelected ? .white : .clear
        
        if isSelected {
            // Add checkmark
            let checkmark = UIImageView(image: UIImage(systemName: "checkmark"))
            checkmark.tintColor = .black
            checkmark.translatesAutoresizingMaskIntoConstraints = false
            selectionIndicator.addSubview(checkmark)
            NSLayoutConstraint.activate([
                checkmark.centerXAnchor.constraint(equalTo: selectionIndicator.centerXAnchor),
                checkmark.centerYAnchor.constraint(equalTo: selectionIndicator.centerYAnchor)
            ])
        } else {
            selectionIndicator.subviews.forEach { $0.removeFromSuperview() }
        }
    }
}
