module Jekyll
  
  CACHE_FILE_NAME = "manifest.appcache"
  CACHE_TEMPLATE_START = "CACHE MANIFEST\n"
  CACHE_TEMPLATE_FILES = "CACHE:\n"
  CACHE_TEMPLATE_FALLBACK = "FALLBACK:\n"
  CACHE_TEMPLATE_NETWORK = "NETWORK:\n*\n"
  
  class Post
    attr_accessor :name
    
    def full_path_to_source
      File.join(@base, @name)
    end
    
  end
  
  class Page
    attr_accessor :name
    
    def full_path_to_source
      File.join(@dir, @name)
    end
    
  end
  
  class AppcacheFile < StaticFile
    def write(dest)
      begin
        super(dest)
      rescue
      end
      
      true
    end
  end
  
  class Appcache < Generator
    def generate(site)
      filestring = CACHE_TEMPLATE_START
      time = Time.new
      filestring += "\# " + time.inspect + "\n\n"

      filestring += CACHE_TEMPLATE_FILES
      filestring = fetch_posts(site, filestring)
      filestring = fetch_pages(site, filestring)
      filestring = fetch_projects(site, filestring)
      filestring = fetch_css(site, filestring)
      filestring = fetch_js(site, filestring)
      filestring = fetch_images(site, filestring)
      
      filestring += "\n" + CACHE_TEMPLATE_FALLBACK + "\n" + CACHE_TEMPLATE_NETWORK
      
      file = File.new(File.join(site.dest, CACHE_FILE_NAME), "w")
      file.write(filestring)
      file.close
      
      site.static_files << Jekyll::AppcacheFile.new(site, site.dest, "/", CACHE_FILE_NAME)
    end
    
    def fetch_posts(site, filestring)
      site.posts.each do |post|
        filestring += ( post.url + "\n" )
      end
      
      filestring
    end
    
    def fetch_pages(site, filestring)
      site.pages.each do |page|
        filestring += ( page.full_path_to_source + "\n" ) if page.full_path_to_source != "/htaccess"
      end
      
      filestring
    end
    
    def fetch_projects(site, filestring)
      {}.tap do |projects|
        Dir['_projects/*.yml'].each do |path|
          name   = File.basename(path, '.yml')
          name = name[3,name.length]
          mybase = File.dirname(File.dirname(__FILE__)) + "/"
          config = YAML.load(File.read(File.join(mybase, path)))
          filestring += "/projects/" + name + "/index.html\n" if config['published']
        end
      end
      
      filestring
    end
    
    def fetch_css(site, filestring)
      Dir['css/*.css'].each do |path|
          filestring += "/" + path + "\n"
      end
      
      filestring
    end
    
    def fetch_js(site, filestring)
      Dir['js/*.js'].each do |path|
          filestring += "/" + path + "\n"
      end
      
      filestring
    end
    
    def fetch_images(site, filestring)
      Dir['images/*.*'].each do |path|
          filestring += "/" + path + "\n"
      end
      
      filestring
    end
    
  end
end