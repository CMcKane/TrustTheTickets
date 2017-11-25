class JsonDictionaryConverter(object):

    #def __init__(self):

    def build_filter_dictionary(json):
        dictionary = None
        if json:
            dictionary = dict(
                            date_from = json[0],
                            date_to = json[1],
                            price_from = json[2],
                            price_to = json[3],
                            section = json[4]
                            )
        return dictionary