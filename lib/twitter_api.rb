class TwitterApi
  LANG = 'en'.freeze
  RESULT_TYPES = %w(mixed recent popular).freeze
  MIXED = 'mixed'.freeze
  RESULTS_TOTAL_COUNT = 100
  HASHTAGS_TOTAL_COUNT = 10

  def initialize(query: query_value, result_type:)
    result_type = set_result_type(result_type)
    @search = client.search(query, lang: LANG, result_type: result_type).take(RESULTS_TOTAL_COUNT)
  rescue Twitter::Error
    @search = []
  end

  def return_results
    @search.map { |tweet| { user_name: tweet.user.screen_name, text: tweet.text } }
  end

  def find_hashtags
    hashtags_objects = @search.map { |tweet| tweet.hashtags if tweet.hashtags? }.compact
    hashtags = hashtags_objects.flatten.map { |hashtag| hashtag.attrs[:text] }

    Hash[
      hashtags.each_with_object(Hash.new(0)) do |value, memo|
        memo[value] += 1
      end.sort_by { |key, value| value }.reverse.take(HASHTAGS_TOTAL_COUNT)
    ]
  end

  private

  def client
    @client ||= Twitter::REST::Client.new do |config|
      config.consumer_key        = Rails.application.secrets.twitter[:consumer_key]
      config.consumer_secret     = Rails.application.secrets.twitter[:consumer_secret]
      config.access_token        = Rails.application.secrets.twitter[:access_token]
      config.access_token_secret = Rails.application.secrets.twitter[:access_token_secret]
    end
  end

  def set_result_type(result_type)
    RESULT_TYPES.include?(result_type) ? result_type : MIXED
  end
end
