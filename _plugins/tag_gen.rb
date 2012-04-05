module Jekyll
  class TagIndex < Page
    def initialize(site, base, dir, tag)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'
      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'tag_index.html')
      self.data['tag'] = tag
      tag_title_prefix = site.config['tag_title_prefix'] || 'Posts Tagged &ldquo;'
      tag_title_suffix = site.config['tag_title_suffix'] || '&rdquo;'
      self.data['title'] = "#{tag_title_prefix}#{tag}#{tag_title_suffix}"
      self.data['projects'] = self.get_projects(site)
    end

    def get_projects(site)
      {}.tap do |projects|
        Dir['_projects/*.yml'].each do |path|
          name   = File.basename(path, '.yml')
          name = name[3,name.length]
          config = YAML.load(File.read(File.join(@base, path)))
          projects[name] = config if config['published']
        end
      end
    end
  end
  
  class ProjectIndex < Page
    def initialize(site, base, dir, path)
      @site = site
      @base = base
      @dir = dir
      @name = "index.html"
      self.data = YAML.load(File.read(File.join(@base, path)))
      self.process(@name) if self.data['published']
    end
  end
  
  class TagGenerator < Generator
    safe true
    priority :high
    
    def generate(site)
      self.write_posts(site)
    end
    
    def write_posts(site)
      if site.layouts.key? 'tag_index'
        dir = site.config['tag_dir'] || 'tag'
        site.tags.keys.each do |tag|
          puts 'tag: ' + tag
          self.write_tag_index(site, File.join(dir, tag), tag)
        end
        Dir['_projects/*.yml'].each do |path|
          puts path
          name = File.basename(path, '.yml')
          name = name[3,name.length]
          puts name
          config = ProjectIndex.new(site, site.source, "/projects/#{name}", path)
          if config.data['published']
            config.data['tags'].each do |t|
              puts 'project: ' + t
              self.write_tag_index(site, File.join('tag', t), t)
            end
          end
        end
      end
    end
    
    def write_tag_index(site, dir, tag)
      index = TagIndex.new(site, site.source, dir, tag)
      index.render(site.layouts, site.site_payload)
      index.write(site.dest)
      site.pages << index
      site.static_files << index
    end
  end
end