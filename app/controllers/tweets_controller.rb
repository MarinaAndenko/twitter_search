class TweetsController < ApplicationController
  def index
    if tweets_params.blank?
      @results = []
      @hashtags = {}
    else
      @results = twitter.return_results
      @hashtags = twitter.find_hashtags

      respond_to do |format|
        format.html
        format.json { render json: { results: @results, hashtags: @hashtags } }
      end
    end
  end

  private

  def twitter
    @twitter ||= TwitterApi.new(query: tweets_params[:query], result_type: tweets_params[:result_type])
  end

  def tweets_params
    params.permit(:query, :result_type)
  end
end
