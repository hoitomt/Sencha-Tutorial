class ContactsController < ApplicationController
  # GET /contacts
  # GET /contacts.xml
  def index
    @contacts = Contact.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @contacts, :dasherize => false }
    end
  end

  # GET /contacts/1
  # GET /contacts/1.xml
  def show
    @contact = Contact.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @contact, :dasherize => false }
    end
  end

  # GET /contacts/new
  # GET /contacts/new.xml
  def new
    @contact = Contact.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @contact }
    end
  end

  # GET /contacts/1/edit
  def edit
    @contact = Contact.find(params[:id])
  end

  # POST /contacts
  # POST /contacts.xml
  def create
    respond_to do |format|
      format.html {
        @contact = Contact.new(params[:contact])
        if @contact.save
          redirect_to root_path
        else
          render :action => 'new'
        end
      }
      format.xml {
        @contact = parse_sencha_xml
        render :xml => @contact, :status => :created, :dasherize => false
      }
    end
  end

  # PUT /contacts/1
  # PUT /contacts/1.xml
  def update
    @contact = Contact.find(params[:id])

    respond_to do |format|
      if @contact.update_attributes(params[:contact])
        format.html { redirect_to(@contact, :notice => 'Contact was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @contact.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /contacts/1
  # DELETE /contacts/1.xml
  def destroy
    @contact = Contact.find(params[:id])
    @contact.destroy

    respond_to do |format|
      format.html { redirect_to(contacts_url) }
      format.xml  { head :ok }
    end
  end

  def parse_sencha_xml
    p_hash = params[:xmlData][:contact]
    return nil if p_hash.nil? || p_hash.empty?
    # call update if the remote_id is populated, means it's already in the db
    if p_hash['remote_id'].to_i > 0
      return update_record(p_hash)
    end
    contact = Contact.create!(parse_contact_params(p_hash))
    logger.info("The new contact: #{contact}")
    return contact
  end

  def update_record(p_hash)
    id = params[:xmlData][:contact]['remote_id']
    logger.info("Remote ID: #{id}")
    c = Contact.find(id)
    logger.info("Updated Contact: #{c}")
    update_params = parse_contact_params(p_hash)
    logger.info("Update Params: #{update_params }")
    c.update_attributes(update_params)
    return c
  end

  def parse_contact_params(p_hash)
    contact_hash = Hash.new
    attr = Contact.new.attributes
    p_hash.each do |key, value|
      if (key == 'id' || key == 'remote_id' )
        # skip, this is the device PK or the db PK.  The db PK has already been
        # captured
      elsif attr.has_key?(key)
        logger.info("Good Key: #{key}")
        logger.info("Good Value: #{value}")
        contact_hash[key] = value
      end
    end
    logger.info("Contact Hash: #{contact_hash}")
    return contact_hash
  end

end
